import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { GuestsService } from '../guests/guests.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdatePaymentStatusDto } from './dto/update-booking.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private guestsService: GuestsService,
  ) {}

  /**
   * Create a new booking
   */
  async create(createBookingDto: CreateBookingDto) {
    // Validate tour exists and is active
    const tour = await this.prisma.tour.findUnique({
      where: { id: createBookingDto.tourId },
      select: {
        id: true,
        title: true,
        price: true,
        maxGroupSize: true,
        isActive: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    if (!tour.isActive) {
      throw new BadRequestException('This tour is currently unavailable');
    }

    // Check max group size
    if (
      tour.maxGroupSize &&
      createBookingDto.numberOfPeople > tour.maxGroupSize
    ) {
      throw new BadRequestException(
        `Maximum group size for this tour is ${tour.maxGroupSize} people`,
      );
    }

    // Validate travel date is in the future
    const travelDate = new Date(createBookingDto.travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (travelDate < today) {
      throw new BadRequestException('Travel date must be in the future');
    }

    // Calculate total price
    const totalPrice = new Decimal(tour.price.toString()).mul(
      createBookingDto.numberOfPeople,
    );

    // Find or create guest for customer tracking
    const guest = await this.guestsService.findOrCreate({
      email: createBookingDto.customerEmail,
      name: createBookingDto.customerName,
      phone: createBookingDto.customerPhone,
    });

    // Create booking with guest link
    const booking = await this.prisma.booking.create({
      data: {
        tourId: createBookingDto.tourId,
        guestId: guest.id,
        customerName: createBookingDto.customerName,
        customerEmail: createBookingDto.customerEmail,
        customerPhone: createBookingDto.customerPhone,
        travelDate,
        numberOfPeople: createBookingDto.numberOfPeople,
        totalPrice,
        specialRequests: createBookingDto.specialRequests,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
          },
        },
        guest: {
          select: {
            id: true,
            totalBookings: true,
          },
        },
      },
    });

    // Update guest stats (non-blocking)
    this.guestsService.updateStats(guest.id, totalPrice).catch((error) => {
      this.logger.error(`Failed to update guest stats: ${error.message}`);
    });

    this.logger.log(
      `New booking created: ${booking.id} for tour ${tour.title} (Guest: ${guest.email})`,
    );

    // Send email notifications (non-blocking)
    this.sendBookingEmails(booking, tour.title).catch((error) => {
      this.logger.error(`Failed to send booking emails: ${error.message}`);
    });

    return {
      message:
        'Your booking has been received! We will contact you shortly to confirm.',
      booking: {
        id: booking.id,
        tourTitle: tour.title,
        travelDate: booking.travelDate,
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    };
  }

  /**
   * Send booking notification emails
   */
  private async sendBookingEmails(
    booking: any,
    tourTitle: string,
  ): Promise<void> {
    const formattedDate = booking.travelDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send confirmation to customer
    await this.emailService.sendBookingConfirmation({
      email: booking.customerEmail,
      name: booking.customerName,
      tourTitle,
      date: formattedDate,
      numberOfPeople: booking.numberOfPeople,
      totalPrice: Number(booking.totalPrice),
      bookingId: booking.id,
    });

    // Send notification to admin
    await this.emailService.sendBookingNotification({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      tourTitle,
      date: formattedDate,
      numberOfPeople: booking.numberOfPeople,
      totalPrice: Number(booking.totalPrice),
      bookingId: booking.id,
    });
  }

  /**
   * Find all bookings (admin only)
   */
  async findAll(options?: {
    status?: string;
    paymentStatus?: string;
    tourId?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, paymentStatus, tourId, page = 1, limit = 20 } = options || {};

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (tourId) where.tourId = tourId;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          tour: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          guest: {
            select: {
              id: true,
              name: true,
              email: true,
              totalBookings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Find booking by ID (admin only)
   */
  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            duration: true,
            images: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            country: true,
            preferredLanguage: true,
            totalBookings: true,
            totalSpent: true,
            lastBookingAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Update booking details (admin only)
   */
  async update(id: string, updateDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        ...(updateDto.travelDate && { travelDate: new Date(updateDto.travelDate) }),
        ...(updateDto.numberOfPeople && { numberOfPeople: updateDto.numberOfPeople }),
        ...(updateDto.specialRequests !== undefined && { specialRequests: updateDto.specialRequests }),
      },
      include: {
        tour: {
          select: {
            title: true,
          },
        },
        guest: true,
      },
    });

    this.logger.log(`Booking ${id} updated`);

    return updated;
  }

  /**
   * Update booking status (admin only)
   */
  async updateStatus(id: string, updateDto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tour: {
          select: { title: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: updateDto.status,
        notes: updateDto.notes ?? booking.notes,
      },
      include: {
        tour: {
          select: {
            title: true,
          },
        },
      },
    });

    this.logger.log(`Booking ${id} status updated to ${updateDto.status}`);

    return updated;
  }

  /**
   * Update payment status (admin only)
   */
  async updatePaymentStatus(id: string, updateDto: UpdatePaymentStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: updateDto.paymentStatus,
      },
    });

    this.logger.log(
      `Booking ${id} payment status updated to ${updateDto.paymentStatus}`,
    );

    return updated;
  }

  /**
   * Get booking statistics (admin only)
   */
  async getStats() {
    const [total, pending, confirmed, cancelled, revenue] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'pending' } }),
      this.prisma.booking.count({ where: { status: 'confirmed' } }),
      this.prisma.booking.count({ where: { status: 'cancelled' } }),
      this.prisma.booking.aggregate({
        where: { status: 'confirmed' },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      total,
      pending,
      confirmed,
      cancelled,
      totalRevenue: revenue._sum.totalPrice || 0,
    };
  }

  /**
   * Delete booking (admin only)
   */
  async remove(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.prisma.booking.delete({
      where: { id },
    });

    this.logger.log(`Booking ${id} deleted`);

    return { message: 'Booking deleted successfully' };
  }

  // ============================================================================
  // GUIDE & DRIVER ASSIGNMENT
  // ============================================================================

  /**
   * Assign guide to booking
   */
  async assignGuide(bookingId: string, guideId: string, role?: string) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify guide exists
    const guide = await this.prisma.guide.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Create assignment (upsert to handle duplicate gracefully)
    const assignment = await this.prisma.bookingGuide.upsert({
      where: {
        bookingId_guideId: { bookingId, guideId },
      },
      create: {
        bookingId,
        guideId,
        role,
      },
      update: {
        role,
      },
      include: {
        guide: true,
      },
    });

    this.logger.log(`Guide ${guideId} assigned to booking ${bookingId}`);

    return assignment;
  }

  /**
   * Remove guide from booking
   */
  async removeGuide(bookingId: string, guideId: string) {
    const assignment = await this.prisma.bookingGuide.findUnique({
      where: {
        bookingId_guideId: { bookingId, guideId },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Guide assignment not found');
    }

    await this.prisma.bookingGuide.delete({
      where: {
        bookingId_guideId: { bookingId, guideId },
      },
    });

    this.logger.log(`Guide ${guideId} removed from booking ${bookingId}`);

    return { message: 'Guide removed from booking' };
  }

  /**
   * Assign driver to booking
   */
  async assignDriver(bookingId: string, driverId: string) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify driver exists
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Create assignment (upsert to handle duplicate gracefully)
    const assignment = await this.prisma.bookingDriver.upsert({
      where: {
        bookingId_driverId: { bookingId, driverId },
      },
      create: {
        bookingId,
        driverId,
      },
      update: {},
      include: {
        driver: true,
      },
    });

    this.logger.log(`Driver ${driverId} assigned to booking ${bookingId}`);

    return assignment;
  }

  /**
   * Remove driver from booking
   */
  async removeDriver(bookingId: string, driverId: string) {
    const assignment = await this.prisma.bookingDriver.findUnique({
      where: {
        bookingId_driverId: { bookingId, driverId },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Driver assignment not found');
    }

    await this.prisma.bookingDriver.delete({
      where: {
        bookingId_driverId: { bookingId, driverId },
      },
    });

    this.logger.log(`Driver ${driverId} removed from booking ${bookingId}`);

    return { message: 'Driver removed from booking' };
  }

  /**
   * Get booking with assigned staff
   */
  async getBookingWithStaff(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        guides: {
          include: {
            guide: true,
          },
        },
        drivers: {
          include: {
            driver: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
}
