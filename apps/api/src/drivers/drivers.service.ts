import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new driver
   */
  async create(createDriverDto: CreateDriverDto) {
    const driver = await this.prisma.driver.create({
      data: {
        name: createDriverDto.name,
        phone: createDriverDto.phone,
        licenseNumber: createDriverDto.licenseNumber,
        languages: createDriverDto.languages || [],
        notes: createDriverDto.notes,
      },
    });

    this.logger.log(`Driver created: ${driver.id} - ${driver.name}`);

    return driver;
  }

  /**
   * Find all drivers with search and pagination
   */
  async findAll(options?: {
    search?: string;
    language?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, language, isActive, page = 1, limit = 20 } = options || {};

    const where: any = {};

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Search by name or license number
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by language
    if (language) {
      where.languages = { has: language };
    }

    const [drivers, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      }),
      this.prisma.driver.count({ where }),
    ]);

    return {
      data: drivers,
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
   * Find driver by ID with booking history
   */
  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            booking: {
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
          orderBy: {
            booking: {
              travelDate: 'desc',
            },
          },
          take: 20, // Last 20 assignments
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  /**
   * Update driver
   */
  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const updated = await this.prisma.driver.update({
      where: { id },
      data: {
        ...(updateDriverDto.name && { name: updateDriverDto.name }),
        ...(updateDriverDto.phone !== undefined && { phone: updateDriverDto.phone }),
        ...(updateDriverDto.licenseNumber !== undefined && { licenseNumber: updateDriverDto.licenseNumber }),
        ...(updateDriverDto.languages && { languages: updateDriverDto.languages }),
        ...(updateDriverDto.notes !== undefined && { notes: updateDriverDto.notes }),
        ...(updateDriverDto.isActive !== undefined && { isActive: updateDriverDto.isActive }),
      },
    });

    this.logger.log(`Driver ${id} updated`);

    return updated;
  }

  /**
   * Soft delete driver (set isActive = false)
   */
  async remove(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    await this.prisma.driver.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Driver ${id} deactivated`);

    return { message: 'Driver deactivated successfully' };
  }

  /**
   * Get driver statistics
   */
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.driver.count(),
      this.prisma.driver.count({ where: { isActive: true } }),
      this.prisma.driver.count({ where: { isActive: false } }),
    ]);

    // Get most assigned drivers
    const topDrivers = await this.prisma.driver.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      total,
      active,
      inactive,
      topDrivers: topDrivers.map(d => ({
        id: d.id,
        name: d.name,
        assignmentCount: d._count.bookings,
      })),
    };
  }
}
