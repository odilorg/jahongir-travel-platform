import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierCompanyDto } from './dto/create-supplier-company.dto';
import { UpdateSupplierCompanyDto } from './dto/update-supplier-company.dto';

@Injectable()
export class SupplierCompaniesService {
  private readonly logger = new Logger(SupplierCompaniesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new supplier company
   */
  async create(createSupplierCompanyDto: CreateSupplierCompanyDto) {
    const company = await this.prisma.supplierCompany.create({
      data: {
        name: createSupplierCompanyDto.name,
        contactPerson: createSupplierCompanyDto.contactPerson,
        phone: createSupplierCompanyDto.phone,
        email: createSupplierCompanyDto.email,
        address: createSupplierCompanyDto.address,
        notes: createSupplierCompanyDto.notes,
        isActive: createSupplierCompanyDto.isActive ?? true,
      },
      include: {
        _count: {
          select: {
            drivers: true,
            guides: true,
            contracts: true,
          },
        },
      },
    });

    this.logger.log(`Supplier company created: ${company.id} - ${company.name}`);

    return company;
  }

  /**
   * Find all supplier companies with search and pagination
   */
  async findAll(options?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, isActive, page = 1, limit = 20 } = options || {};

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      this.prisma.supplierCompany.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              drivers: true,
              guides: true,
              contracts: true,
            },
          },
        },
      }),
      this.prisma.supplierCompany.count({ where }),
    ]);

    return {
      data: companies,
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
   * Get supplier company stats
   */
  async getStats() {
    const [total, active, inactive, withDrivers, withGuides] = await Promise.all([
      this.prisma.supplierCompany.count(),
      this.prisma.supplierCompany.count({ where: { isActive: true } }),
      this.prisma.supplierCompany.count({ where: { isActive: false } }),
      this.prisma.supplierCompany.count({
        where: { drivers: { some: {} } },
      }),
      this.prisma.supplierCompany.count({
        where: { guides: { some: {} } },
      }),
    ]);

    // Get active contracts count
    const activeContracts = await this.prisma.supplierContract.count({
      where: {
        status: 'active',
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    return {
      total,
      active,
      inactive,
      withDrivers,
      withGuides,
      activeContracts,
    };
  }

  /**
   * Find supplier company by ID with details
   */
  async findOne(id: string) {
    const company = await this.prisma.supplierCompany.findUnique({
      where: { id },
      include: {
        drivers: {
          select: {
            id: true,
            name: true,
            phone: true,
            isActive: true,
          },
          orderBy: { name: 'asc' },
        },
        guides: {
          select: {
            id: true,
            name: true,
            phone: true,
            isActive: true,
          },
          orderBy: { name: 'asc' },
        },
        contracts: {
          orderBy: { startDate: 'desc' },
          include: {
            rates: {
              orderBy: [{ supplierType: 'asc' }, { serviceType: 'asc' }],
            },
          },
        },
        _count: {
          select: {
            drivers: true,
            guides: true,
            contracts: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Supplier company not found');
    }

    return company;
  }

  /**
   * Update supplier company
   */
  async update(id: string, updateSupplierCompanyDto: UpdateSupplierCompanyDto) {
    const company = await this.prisma.supplierCompany.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Supplier company not found');
    }

    const updated = await this.prisma.supplierCompany.update({
      where: { id },
      data: updateSupplierCompanyDto,
      include: {
        _count: {
          select: {
            drivers: true,
            guides: true,
            contracts: true,
          },
        },
      },
    });

    this.logger.log(`Supplier company ${id} updated`);

    return updated;
  }

  /**
   * Soft delete supplier company (set isActive = false)
   */
  async remove(id: string) {
    const company = await this.prisma.supplierCompany.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Supplier company not found');
    }

    await this.prisma.supplierCompany.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Supplier company ${id} deactivated`);

    return { message: 'Supplier company deactivated successfully' };
  }
}
