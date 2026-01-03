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
    // Verify driver exists
    const driver = await this.prisma.driver.findUnique({
      where: { id: createVehicleDto.driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Check for duplicate plate number
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber: createVehicleDto.plateNumber },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this plate number already exists');
    }

    const vehicle = await this.prisma.vehicle.create({
      data: {
        driverId: createVehicleDto.driverId,
        plateNumber: createVehicleDto.plateNumber,
        make: createVehicleDto.make,
        model: createVehicleDto.model,
        year: createVehicleDto.year,
        color: createVehicleDto.color,
        capacity: createVehicleDto.capacity,
        type: createVehicleDto.type || 'sedan',
        notes: createVehicleDto.notes,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Vehicle created: ${vehicle.plateNumber} for driver ${driver.name}`);

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
    if (driverId) where.driverId = driverId;
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
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
        orderBy: [{ driver: { name: 'asc' } }, { make: 'asc' }, { model: 'asc' }],
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
      where: { driverId, isActive: true },
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
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            licenseNumber: true,
            isActive: true,
          },
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
                    title: true,
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

    const updated = await this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
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
