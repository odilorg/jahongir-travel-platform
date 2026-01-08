import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto, ContractRateDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new contract with optional rates
   */
  async create(createContractDto: CreateContractDto) {
    const { rates, ...contractData } = createContractDto;

    // Verify company exists
    const company = await this.prisma.supplierCompany.findUnique({
      where: { id: contractData.companyId },
    });

    if (!company) {
      throw new NotFoundException('Supplier company not found');
    }

    const contract = await this.prisma.supplierContract.create({
      data: {
        companyId: contractData.companyId,
        startDate: new Date(contractData.startDate),
        endDate: contractData.endDate ? new Date(contractData.endDate) : null,
        status: contractData.status || 'active',
        terms: contractData.terms,
        notes: contractData.notes,
        // Create rates if provided
        ...(rates && rates.length > 0 && {
          rates: {
            create: rates.map((rate) => ({
              supplierType: rate.supplierType,
              serviceType: rate.serviceType,
              amount: rate.amount,
              currency: rate.currency || 'USD',
              notes: rate.notes,
            })),
          },
        }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        rates: {
          orderBy: [{ supplierType: 'asc' }, { serviceType: 'asc' }],
        },
      },
    });

    this.logger.log(`Contract created: ${contract.id} for company ${company.name}`);

    return contract;
  }

  /**
   * Find all contracts with filters
   */
  async findAll(options?: {
    companyId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, status, page = 1, limit = 20 } = options || {};

    const where: any = {};

    if (companyId) {
      where.companyId = companyId;
    }

    if (status) {
      where.status = status;
    }

    const [contracts, total] = await Promise.all([
      this.prisma.supplierContract.findMany({
        where,
        orderBy: { startDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          rates: {
            orderBy: [{ supplierType: 'asc' }, { serviceType: 'asc' }],
          },
          _count: {
            select: { rates: true },
          },
        },
      }),
      this.prisma.supplierContract.count({ where }),
    ]);

    return {
      data: contracts,
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
   * Find contract by ID with full details
   */
  async findOne(id: string) {
    const contract = await this.prisma.supplierContract.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            contactPerson: true,
            phone: true,
            email: true,
          },
        },
        rates: {
          orderBy: [{ supplierType: 'asc' }, { serviceType: 'asc' }],
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  /**
   * Update contract
   */
  async update(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.prisma.supplierContract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const { rates, ...contractData } = updateContractDto;

    // Update contract data
    const updateData: any = {};
    if (contractData.startDate) updateData.startDate = new Date(contractData.startDate);
    if (contractData.endDate !== undefined) {
      updateData.endDate = contractData.endDate ? new Date(contractData.endDate) : null;
    }
    if (contractData.status) updateData.status = contractData.status;
    if (contractData.terms !== undefined) updateData.terms = contractData.terms;
    if (contractData.notes !== undefined) updateData.notes = contractData.notes;

    const updated = await this.prisma.supplierContract.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        rates: {
          orderBy: [{ supplierType: 'asc' }, { serviceType: 'asc' }],
        },
      },
    });

    this.logger.log(`Contract ${id} updated`);

    return updated;
  }

  /**
   * Add or update rates for a contract
   */
  async upsertRates(contractId: string, rates: ContractRateDto[]) {
    const contract = await this.prisma.supplierContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Use upsert for each rate (unique constraint on contractId + supplierType + serviceType)
    const upsertPromises = rates.map((rate) =>
      this.prisma.contractRate.upsert({
        where: {
          contractId_supplierType_serviceType: {
            contractId,
            supplierType: rate.supplierType,
            serviceType: rate.serviceType,
          },
        },
        update: {
          amount: rate.amount,
          currency: rate.currency || 'USD',
          notes: rate.notes,
        },
        create: {
          contractId,
          supplierType: rate.supplierType,
          serviceType: rate.serviceType,
          amount: rate.amount,
          currency: rate.currency || 'USD',
          notes: rate.notes,
        },
      }),
    );

    await Promise.all(upsertPromises);

    this.logger.log(`Contract ${contractId} rates updated`);

    // Return updated contract with all rates
    return this.findOne(contractId);
  }

  /**
   * Delete a specific rate from contract
   */
  async deleteRate(contractId: string, rateId: string) {
    const rate = await this.prisma.contractRate.findFirst({
      where: {
        id: rateId,
        contractId,
      },
    });

    if (!rate) {
      throw new NotFoundException('Contract rate not found');
    }

    await this.prisma.contractRate.delete({
      where: { id: rateId },
    });

    this.logger.log(`Contract rate ${rateId} deleted`);

    return { message: 'Rate deleted successfully' };
  }

  /**
   * Delete contract
   */
  async remove(id: string) {
    const contract = await this.prisma.supplierContract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Cascade delete will remove associated rates
    await this.prisma.supplierContract.delete({
      where: { id },
    });

    this.logger.log(`Contract ${id} deleted`);

    return { message: 'Contract deleted successfully' };
  }

  /**
   * Get contract statistics
   */
  async getStats() {
    const now = new Date();

    const [total, active, expired, pending] = await Promise.all([
      this.prisma.supplierContract.count(),
      this.prisma.supplierContract.count({
        where: {
          status: 'active',
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      }),
      this.prisma.supplierContract.count({
        where: {
          OR: [
            { status: 'expired' },
            { endDate: { lt: now } },
          ],
        },
      }),
      this.prisma.supplierContract.count({
        where: { status: 'pending' },
      }),
    ]);

    return {
      total,
      active,
      expired,
      pending,
    };
  }
}
