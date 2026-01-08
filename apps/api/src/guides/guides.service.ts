import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { CreateGuideRateDto } from './dto/guide-rate.dto';

@Injectable()
export class GuidesService {
  private readonly logger = new Logger(GuidesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new guide
   */
  async create(createGuideDto: CreateGuideDto) {
    // Verify company exists if provided
    if (createGuideDto.companyId) {
      const company = await this.prisma.supplierCompany.findUnique({
        where: { id: createGuideDto.companyId },
      });
      if (!company) {
        throw new NotFoundException('Supplier company not found');
      }
    }

    const guide = await this.prisma.guide.create({
      data: {
        name: createGuideDto.name,
        phone: createGuideDto.phone,
        email: createGuideDto.email,
        languages: createGuideDto.languages || [],
        notes: createGuideDto.notes,
        companyId: createGuideDto.companyId,
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

    this.logger.log(`Guide created: ${guide.id} - ${guide.name}`);

    return guide;
  }

  /**
   * Find all guides with search and pagination
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

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
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

    const [guides, total] = await Promise.all([
      this.prisma.guide.findMany({
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
          _count: {
            select: { bookings: true, rates: true },
          },
        },
      }),
      this.prisma.guide.count({ where }),
    ]);

    return {
      data: guides,
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
   * Find guide by ID with booking history
   */
  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
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

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    return guide;
  }

  /**
   * Update guide
   */
  async update(id: string, updateGuideDto: UpdateGuideDto) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    const { companyId, ...guideData } = updateGuideDto;

    // Verify company exists if changing company
    if (companyId !== undefined && companyId !== null && companyId !== '') {
      const company = await this.prisma.supplierCompany.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        throw new NotFoundException('Supplier company not found');
      }
    }

    const updated = await this.prisma.guide.update({
      where: { id },
      data: {
        ...(guideData.name && { name: guideData.name }),
        ...(guideData.phone !== undefined && { phone: guideData.phone }),
        ...(guideData.email !== undefined && { email: guideData.email }),
        ...(guideData.languages && { languages: guideData.languages }),
        ...(guideData.notes !== undefined && { notes: guideData.notes }),
        ...(guideData.isActive !== undefined && { isActive: guideData.isActive }),
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
      },
    });

    this.logger.log(`Guide ${id} updated`);

    return updated;
  }

  /**
   * Soft delete guide (set isActive = false)
   */
  async remove(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    await this.prisma.guide.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`Guide ${id} deactivated`);

    return { message: 'Guide deactivated successfully' };
  }

  /**
   * Get guide statistics
   */
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.guide.count(),
      this.prisma.guide.count({ where: { isActive: true } }),
      this.prisma.guide.count({ where: { isActive: false } }),
    ]);

    // Get most assigned guides
    const topGuides = await this.prisma.guide.findMany({
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
      topGuides: topGuides.map(g => ({
        id: g.id,
        name: g.name,
        assignmentCount: g._count.bookings,
      })),
    };
  }

  // ==================== Rate Management ====================

  /**
   * Get all rates for a guide
   */
  async getRates(guideId: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    const rates = await this.prisma.guideRate.findMany({
      where: { guideId },
      orderBy: { serviceType: 'asc' },
    });

    return rates;
  }

  /**
   * Create or update a rate for a guide
   */
  async upsertRate(guideId: string, rateDto: CreateGuideRateDto) {
    const guide = await this.prisma.guide.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      throw new NotFoundException('Guide not found');
    }

    // Use upsert with unique constraint on guideId + serviceType
    const rate = await this.prisma.guideRate.upsert({
      where: {
        guideId_serviceType: {
          guideId,
          serviceType: rateDto.serviceType,
        },
      },
      update: {
        amount: rateDto.amount,
        currency: rateDto.currency || 'USD',
        notes: rateDto.notes,
      },
      create: {
        guideId,
        serviceType: rateDto.serviceType,
        amount: rateDto.amount,
        currency: rateDto.currency || 'USD',
        notes: rateDto.notes,
      },
    });

    this.logger.log(`Guide ${guideId} rate ${rateDto.serviceType} set to ${rateDto.amount}`);

    return rate;
  }

  /**
   * Delete a rate for a guide
   */
  async deleteRate(guideId: string, rateId: string) {
    const rate = await this.prisma.guideRate.findFirst({
      where: {
        id: rateId,
        guideId,
      },
    });

    if (!rate) {
      throw new NotFoundException('Guide rate not found');
    }

    await this.prisma.guideRate.delete({
      where: { id: rateId },
    });

    this.logger.log(`Guide ${guideId} rate ${rateId} deleted`);

    return { message: 'Rate deleted successfully' };
  }
}
