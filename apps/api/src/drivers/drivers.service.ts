import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverRateDto } from './dto/driver-rate.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new driver
   */
  async create(createDriverDto: CreateDriverDto) {
    // Verify company exists if provided
    if (createDriverDto.companyId) {
      const company = await this.prisma.supplierCompany.findUnique({
        where: { id: createDriverDto.companyId },
      });
      if (!company) {
        throw new NotFoundException('Supplier company not found');
      }
    }

    const driver = await this.prisma.driver.create({
      data: {
        name: createDriverDto.name,
        phone: createDriverDto.phone,
        licenseNumber: createDriverDto.licenseNumber,
        languages: createDriverDto.languages || [],
        notes: createDriverDto.notes,
        companyId: createDriverDto.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
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
    companyId?: string;
    freelancersOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, language, isActive, companyId, freelancersOnly, page = 1, limit = 20 } = options || {};

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

    // Filter by company
    if (companyId) {
      where.companyId = companyId;
    }

    // Filter freelancers only (no company)
    if (freelancersOnly) {
      where.companyId = null;
    }

    const [drivers, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          vehicles: {
            include: {
              vehicle: {
                select: {
                  id: true,
                  plateNumber: true,
                  make: true,
                  model: true,
                  type: true,
                },
              },
            },
            orderBy: { isPrimary: 'desc' },
          },
          _count: {
            select: { bookings: true, rates: true },
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
        company: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
          },
        },
        rates: {
          orderBy: { serviceType: 'asc' },
        },
        vehicles: {
          include: {
            vehicle: {
              select: {
                id: true,
                plateNumber: true,
                make: true,
                model: true,
                type: true,
              },
            },
          },
          orderBy: { isPrimary: 'desc' },
        },
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
          select: { bookings: true, rates: true },
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

    // Extract vehicleId and companyId for separate handling
    const { vehicleId, companyId, ...driverData } = updateDriverDto;

    // Verify company exists if changing company
    if (companyId !== undefined && companyId !== null && companyId !== '') {
      const company = await this.prisma.supplierCompany.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        throw new NotFoundException('Supplier company not found');
      }
    }

    // Handle vehicle assignment update if vehicleId is provided
    if (vehicleId !== undefined) {
      // Remove all existing vehicle assignments for this driver
      await this.prisma.driverVehicle.deleteMany({
        where: { driverId: id },
      });

      // Add new vehicle assignment if vehicleId is not empty
      if (vehicleId && vehicleId !== '') {
        // One vehicle can only belong to one driver at a time
        // Remove any existing assignment for this vehicle
        await this.prisma.driverVehicle.deleteMany({
          where: { vehicleId },
        });

        await this.prisma.driverVehicle.create({
          data: {
            driverId: id,
            vehicleId,
            isPrimary: true,
          },
        });
      }
    }

    const updated = await this.prisma.driver.update({
      where: { id },
      data: {
        ...(driverData.name && { name: driverData.name }),
        ...(driverData.phone !== undefined && { phone: driverData.phone }),
        ...(driverData.licenseNumber !== undefined && { licenseNumber: driverData.licenseNumber }),
        ...(driverData.languages && { languages: driverData.languages }),
        ...(driverData.notes !== undefined && { notes: driverData.notes }),
        ...(driverData.isActive !== undefined && { isActive: driverData.isActive }),
        // Handle companyId - allow setting to null (freelancer) or a valid company
        ...(companyId !== undefined && { companyId: companyId || null }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        rates: {
          orderBy: { serviceType: 'asc' },
        },
        vehicles: {
          include: {
            vehicle: {
              select: {
                id: true,
                plateNumber: true,
                make: true,
                model: true,
                type: true,
              },
            },
          },
          orderBy: { isPrimary: 'desc' },
        },
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

  // ==================== Rate Management ====================

  /**
   * Get all rates for a driver
   */
  async getRates(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const rates = await this.prisma.driverRate.findMany({
      where: { driverId },
      orderBy: { serviceType: 'asc' },
    });

    return rates;
  }

  /**
   * Create or update a rate for a driver
   */
  async upsertRate(driverId: string, rateDto: CreateDriverRateDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Use upsert with unique constraint on driverId + serviceType
    const rate = await this.prisma.driverRate.upsert({
      where: {
        driverId_serviceType: {
          driverId,
          serviceType: rateDto.serviceType,
        },
      },
      update: {
        amount: rateDto.amount,
        currency: rateDto.currency || 'USD',
        notes: rateDto.notes,
      },
      create: {
        driverId,
        serviceType: rateDto.serviceType,
        amount: rateDto.amount,
        currency: rateDto.currency || 'USD',
        notes: rateDto.notes,
      },
    });

    this.logger.log(`Driver ${driverId} rate ${rateDto.serviceType} set to ${rateDto.amount}`);

    return rate;
  }

  /**
   * Delete a rate for a driver
   */
  async deleteRate(driverId: string, rateId: string) {
    const rate = await this.prisma.driverRate.findFirst({
      where: {
        id: rateId,
        driverId,
      },
    });

    if (!rate) {
      throw new NotFoundException('Driver rate not found');
    }

    await this.prisma.driverRate.delete({
      where: { id: rateId },
    });

    this.logger.log(`Driver ${driverId} rate ${rateId} deleted`);

    return { message: 'Rate deleted successfully' };
  }
}
