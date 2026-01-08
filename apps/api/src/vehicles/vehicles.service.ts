import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new vehicle
   */
  async create(createVehicleDto: CreateVehicleDto) {
    const { driverId, ...vehicleData } = createVehicleDto;

    // Verify driver exists if provided
    let driver = null;
    if (driverId) {
      driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found');
      }

      // One vehicle can only belong to one driver at a time
      // Remove any existing vehicle assignment for this driver
      await this.prisma.driverVehicle.deleteMany({
        where: { driverId },
      });
    }

    // Check for duplicate plate number
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber: createVehicleDto.plateNumber },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this plate number already exists');
    }

    // Create vehicle and optionally assign to driver
    const vehicle = await this.prisma.vehicle.create({
      data: {
        plateNumber: vehicleData.plateNumber,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
        capacity: vehicleData.capacity,
        type: vehicleData.type || 'sedan',
        notes: vehicleData.notes,
        // Create driver assignment if driverId provided
        ...(driverId && {
          drivers: {
            create: {
              driverId,
              isPrimary: true,
            },
          },
        }),
      },
      include: {
        drivers: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Vehicle created: ${vehicle.plateNumber}${driver ? ` for driver ${driver.name}` : ''}`);

    return vehicle;
  }

  /**
   * Get all vehicles
   */
  async findAll(options?: {
    driverId?: string;
    type?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { driverId, type, isActive, page = 1, limit = 50 } = options || {};

    const where: any = {};
    // Filter by driver through junction table
    if (driverId) where.drivers = { some: { driverId } };
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: {
          drivers: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  isActive: true,
                },
              },
            },
            orderBy: { isPrimary: 'desc' },
          },
        },
        orderBy: [{ make: 'asc' }, { model: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      data: vehicles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get vehicles for a specific driver
   */
  async findByDriver(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        drivers: { some: { driverId } },
        isActive: true,
      },
      include: {
        drivers: {
          where: { driverId },
          select: { isPrimary: true },
        },
      },
      orderBy: { make: 'asc' },
    });

    return vehicles;
  }

  /**
   * Get a single vehicle by ID
   */
  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        drivers: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                licenseNumber: true,
                isActive: true,
              },
            },
          },
          orderBy: { isPrimary: 'desc' },
        },
        bookings: {
          include: {
            booking: {
              select: {
                id: true,
                customerName: true,
                travelDate: true,
                status: true,
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
          take: 10,
          orderBy: {
            booking: {
              travelDate: 'desc',
            },
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  /**
   * Update a vehicle
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check for duplicate plate number if updating
    if (updateVehicleDto.plateNumber && updateVehicleDto.plateNumber !== vehicle.plateNumber) {
      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { plateNumber: updateVehicleDto.plateNumber },
      });

      if (existingVehicle) {
        throw new ConflictException('Vehicle with this plate number already exists');
      }
    }

    // Remove driverId from update data (handled separately via DriverVehicle)
    const { driverId, ...vehicleData } = updateVehicleDto as any;

    // Handle driver assignment update if driverId is provided
    if (driverId !== undefined) {
      // Remove all existing driver assignments for this vehicle
      await this.prisma.driverVehicle.deleteMany({
        where: { vehicleId: id },
      });

      // Add new driver assignment if driverId is not empty
      if (driverId && driverId !== '') {
        // One vehicle can only belong to one driver at a time
        // Remove any existing vehicle assignment for this driver
        await this.prisma.driverVehicle.deleteMany({
          where: { driverId },
        });

        await this.prisma.driverVehicle.create({
          data: {
            vehicleId: id,
            driverId,
            isPrimary: true,
          },
        });
      }
    }

    const updated = await this.prisma.vehicle.update({
      where: { id },
      data: vehicleData,
      include: {
        drivers: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
          orderBy: { isPrimary: 'desc' },
        },
      },
    });

    this.logger.log(`Vehicle updated: ${updated.plateNumber}`);

    return updated;
  }

  /**
   * Delete a vehicle
   */
  async remove(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    await this.prisma.vehicle.delete({
      where: { id },
    });

    this.logger.log(`Vehicle deleted: ${vehicle.plateNumber}`);

    return { message: 'Vehicle deleted successfully' };
  }

  /**
   * Get vehicle types for dropdown
   */
  getVehicleTypes() {
    return [
      { value: 'sedan', label: 'Sedan', capacity: '1-4' },
      { value: 'suv', label: 'SUV', capacity: '1-6' },
      { value: 'minivan', label: 'Minivan', capacity: '6-8' },
      { value: 'van', label: 'Van', capacity: '8-15' },
      { value: 'bus', label: 'Bus', capacity: '15-50' },
    ];
  }
}
