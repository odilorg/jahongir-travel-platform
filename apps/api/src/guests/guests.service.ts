import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { FindGuestsDto } from './dto/find-guests.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GuestsService {
  private readonly logger = new Logger(GuestsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Find or create a guest by email
   * This is the key method for booking integration
   */
  async findOrCreate(data: {
    email: string;
    name: string;
    phone?: string;
  }) {
    const email = data.email.toLowerCase().trim();

    // Try to find existing guest
    let guest = await this.prisma.guest.findUnique({
      where: { email },
    });

    if (guest) {
      // Update name/phone if provided and different
      const updates: any = {};
      if (data.name && data.name !== guest.name) {
        updates.name = data.name;
      }
      if (data.phone && data.phone !== guest.phone) {
        updates.phone = data.phone;
      }

      if (Object.keys(updates).length > 0) {
        guest = await this.prisma.guest.update({
          where: { id: guest.id },
          data: updates,
        });
        this.logger.log(`Updated existing guest: ${guest.email}`);
      }

      return guest;
    }

    // Create new guest
    guest = await this.prisma.guest.create({
      data: {
        email,
        name: data.name.trim(),
        phone: data.phone,
        preferredLanguage: 'ru',
        totalBookings: 0,
        totalSpent: new Decimal(0),
      },
    });

    this.logger.log(`Created new guest: ${guest.email}`);
    return guest;
  }

  /**
   * Update guest stats after a booking
   */
  async updateStats(guestId: string, bookingAmount: Decimal) {
    await this.prisma.guest.update({
      where: { id: guestId },
      data: {
        totalBookings: { increment: 1 },
        totalSpent: { increment: bookingAmount },
        lastBookingAt: new Date(),
      },
    });

    this.logger.log(`Updated stats for guest: ${guestId}`);
  }

  /**
   * Create a new guest manually (admin)
   */
  async create(createGuestDto: CreateGuestDto) {
    const email = createGuestDto.email.toLowerCase().trim();

    // Check if guest already exists
    const existing = await this.prisma.guest.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('A guest with this email already exists');
    }

    const guest = await this.prisma.guest.create({
      data: {
        email,
        name: createGuestDto.name,
        phone: createGuestDto.phone,
        country: createGuestDto.country,
        preferredLanguage: createGuestDto.preferredLanguage || 'ru',
        notes: createGuestDto.notes,
        totalBookings: 0,
        totalSpent: new Decimal(0),
      },
    });

    this.logger.log(`Created guest manually: ${guest.email}`);
    return guest;
  }

  /**
   * Find all guests with search and pagination (admin)
   */
  async findAll(options: FindGuestsDto) {
    const {
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = options;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [guests, total] = await Promise.all([
      this.prisma.guest.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          country: true,
          preferredLanguage: true,
          totalBookings: true,
          totalSpent: true,
          lastBookingAt: true,
          createdAt: true,
        },
      }),
      this.prisma.guest.count({ where }),
    ]);

    return {
      data: guests,
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
   * Get guest statistics (admin)
   */
  async getStats() {
    const [totalGuests, repeatGuests, totalRevenue, recentGuests] = await Promise.all([
      this.prisma.guest.count(),
      this.prisma.guest.count({
        where: { totalBookings: { gt: 1 } },
      }),
      this.prisma.guest.aggregate({
        _sum: { totalSpent: true },
      }),
      this.prisma.guest.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    // Top guests by bookings
    const topGuestsByBookings = await this.prisma.guest.findMany({
      where: { totalBookings: { gt: 0 } },
      orderBy: { totalBookings: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        totalBookings: true,
        totalSpent: true,
      },
    });

    // Top guests by spending
    const topGuestsBySpending = await this.prisma.guest.findMany({
      where: { totalSpent: { gt: 0 } },
      orderBy: { totalSpent: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        totalBookings: true,
        totalSpent: true,
      },
    });

    return {
      totalGuests,
      repeatGuests,
      repeatRate: totalGuests > 0 ? ((repeatGuests / totalGuests) * 100).toFixed(1) : 0,
      totalRevenue: totalRevenue._sum.totalSpent || 0,
      recentGuests,
      topGuestsByBookings,
      topGuestsBySpending,
    };
  }

  /**
   * Find guest by ID with booking history (admin)
   */
  async findOne(id: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
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
        },
      },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }

  /**
   * Find guest by email
   */
  async findByEmail(email: string) {
    return this.prisma.guest.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  /**
   * Update guest (admin)
   */
  async update(id: string, updateGuestDto: UpdateGuestDto) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    const updated = await this.prisma.guest.update({
      where: { id },
      data: updateGuestDto,
    });

    this.logger.log(`Updated guest: ${updated.email}`);
    return updated;
  }

  /**
   * Delete guest (admin)
   * Only allowed if guest has no bookings
   */
  async remove(id: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    if (guest._count.bookings > 0) {
      throw new BadRequestException(
        `Cannot delete guest with ${guest._count.bookings} booking(s). Remove bookings first or deactivate the guest.`,
      );
    }

    await this.prisma.guest.delete({
      where: { id },
    });

    this.logger.log(`Deleted guest: ${guest.email}`);
    return { message: 'Guest deleted successfully' };
  }
}
