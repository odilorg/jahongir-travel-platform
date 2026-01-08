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
import { getTranslationWithFallback, DEFAULT_LOCALE } from '../i18n';

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
        price: true,
        maxGroupSize: true,
        isActive: true,
        translations: {
          where: { locale: 'en' },
          take: 1,
        },
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

    // Check for duplicate bookings (prevent double-submission)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const startOfDay = new Date(travelDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(travelDate);
    endOfDay.setHours(23, 59, 59, 999);

    const recentDuplicate = await this.prisma.booking.findFirst({
      where: {
        tourId: createBookingDto.tourId,
        customerEmail: createBookingDto.customerEmail.toLowerCase(),
        travelDate: {
          // Same day (ignore time)
          gte: startOfDay,
          lt: endOfDay,
        },
        createdAt: { gte: fiveMinutesAgo },
        status: { not: 'cancelled' },
      },
    });

    if (recentDuplicate) {
      this.logger.warn(
        `Duplicate booking detected: ${createBookingDto.customerEmail} attempted to book tour ${createBookingDto.tourId} again`,
      );
      throw new BadRequestException(
        'A similar booking was created recently. Please check your existing bookings or contact support.',
      );
    }

    // Calculate total price
    const totalPrice = new Decimal(tour.price.toString()).mul(
      createBookingDto.numberOfPeople,
    );

    // Get guest ID - either use provided ID or find/create guest
    let guestId: string;
    if (createBookingDto.guestId) {
      // Admin explicitly selected a guest - use that ID
      guestId = createBookingDto.guestId;
      this.logger.log(`Using pre-selected guest: ${guestId}`);
    } else {
      // Find or create guest for customer tracking
      const guest = await this.guestsService.findOrCreate({
        email: createBookingDto.customerEmail,
        name: createBookingDto.customerName,
        phone: createBookingDto.customerPhone,
      });
      guestId = guest.id;
      this.logger.log(`Found/created guest: ${guestId}`);
    }

    // Create booking with guest link
    const booking = await this.prisma.booking.create({
      data: {
        tourId: createBookingDto.tourId,
        guestId,
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
            id: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
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
    this.guestsService.updateStats(guestId, totalPrice).catch((error) => {
      this.logger.error(`Failed to update guest stats: ${error.message}`);
    });

    const tourTitle = tour.translations[0]?.title || 'Unknown Tour';

    this.logger.log(
      `New booking created: ${booking.id} for tour ${tourTitle} (Guest: ${createBookingDto.customerEmail})`,
    );

    // Send email notifications (non-blocking)
    this.sendBookingEmails(booking, tourTitle).catch((error) => {
      this.logger.error(`Failed to send booking emails: ${error.message}`);
    });

    return {
      message:
        'Your booking has been received! We will contact you shortly to confirm.',
      booking: {
        id: booking.id,
        tourTitle,
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
              duration: true,
              translations: {
                where: { locale: { in: ['en', 'ru', 'uz'] } },
              },
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

    // Transform bookings to flatten tour translations
    const transformedBookings = bookings.map((booking) => {
      if (booking.tour) {
        const translation = getTranslationWithFallback(
          booking.tour.translations,
          DEFAULT_LOCALE,
        );

        return {
          ...booking,
          tour: {
            id: booking.tour.id,
            duration: booking.tour.duration,
            title: translation?.title || '',
            slug: translation?.slug || '',
          },
        };
      }
      return booking;
    });

    return {
      data: transformedBookings,
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
            price: true,
            duration: true,
            images: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
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
      include: {
        tour: {
          select: {
            id: true,
            price: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Recalculate total price if number of people changed
    let totalPrice = booking.totalPrice;
    if (updateDto.numberOfPeople && updateDto.numberOfPeople !== booking.numberOfPeople) {
      totalPrice = new Decimal(booking.tour.price.toString()).mul(
        updateDto.numberOfPeople,
      );
      this.logger.log(
        `Booking ${id} price recalculated: ${booking.numberOfPeople} → ${updateDto.numberOfPeople} people, $${booking.totalPrice} → $${totalPrice}`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        ...(updateDto.travelDate && { travelDate: new Date(updateDto.travelDate) }),
        ...(updateDto.numberOfPeople && { numberOfPeople: updateDto.numberOfPeople }),
        ...(updateDto.numberOfPeople && { totalPrice }), // Update price when people count changes
        ...(updateDto.specialRequests !== undefined && { specialRequests: updateDto.specialRequests }),
      },
      include: {
        tour: {
          select: {
            id: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
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
          select: {
            id: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
          },
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
            id: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
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
  async assignDriver(bookingId: string, driverId: string, vehicleId?: string) {
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

    // If vehicle specified, verify it exists and belongs to this driver
    if (vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: {
          drivers: {
            where: { driverId },
          },
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      // Check if vehicle is assigned to this driver (many-to-many via DriverVehicle)
      if (vehicle.drivers.length === 0) {
        throw new BadRequestException('Vehicle is not assigned to this driver');
      }
    }

    // Create assignment (upsert to handle duplicate gracefully)
    const assignment = await this.prisma.bookingDriver.upsert({
      where: {
        bookingId_driverId: { bookingId, driverId },
      },
      create: {
        bookingId,
        driverId,
        vehicleId,
      },
      update: {
        vehicleId,
      },
      include: {
        driver: true,
        vehicle: true,
      },
    });

    this.logger.log(`Driver ${driverId}${vehicleId ? ` with vehicle ${vehicleId}` : ''} assigned to booking ${bookingId}`);

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
            duration: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
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
            driver: {
              include: {
                vehicles: {
                  include: {
                    vehicle: {
                      select: {
                        id: true,
                        plateNumber: true,
                        make: true,
                        model: true,
                        color: true,
                        capacity: true,
                        type: true,
                        isActive: true,
                      },
                    },
                  },
                },
              },
            },
            vehicle: true,
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
