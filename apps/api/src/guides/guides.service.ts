import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';

@Injectable()
export class GuidesService {
  private readonly logger = new Logger(GuidesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new guide
   */
  async create(createGuideDto: CreateGuideDto) {
    const guide = await this.prisma.guide.create({
      data: {
        name: createGuideDto.name,
        phone: createGuideDto.phone,
        email: createGuideDto.email,
        languages: createGuideDto.languages || [],
        notes: createGuideDto.notes,
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
    page?: number;
    limit?: number;
  }) {
    const { search, language, isActive, page = 1, limit = 20 } = options || {};

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

    const [guides, total] = await Promise.all([
      this.prisma.guide.findMany({
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

    const updated = await this.prisma.guide.update({
      where: { id },
      data: {
        ...(updateGuideDto.name && { name: updateGuideDto.name }),
        ...(updateGuideDto.phone !== undefined && { phone: updateGuideDto.phone }),
        ...(updateGuideDto.email !== undefined && { email: updateGuideDto.email }),
        ...(updateGuideDto.languages && { languages: updateGuideDto.languages }),
        ...(updateGuideDto.notes !== undefined && { notes: updateGuideDto.notes }),
        ...(updateGuideDto.isActive !== undefined && { isActive: updateGuideDto.isActive }),
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
}
