import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { FindAllToursDto } from './dto/find-all-tours.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  constructor(private prisma: PrismaService) {}

  async create(createTourDto: CreateTourDto) {
    try {
      const tour = await this.prisma.tour.create({
        data: {
          ...createTourDto,
          category: {
            connect: { id: createTourDto.categoryId },
          },
        },
        include: {
          category: true,
        },
      });

      this.logger.log(`Created tour: ${tour.title} (${tour.id})`);
      return tour;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Tour with this slug already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async findAll(query: FindAllToursDto) {
    const { page, limit, categoryId, minDuration, maxDuration, minPrice, maxPrice, difficulty, search, sortBy, featured } = query;

    // Build where clause
    const where: Prisma.TourWhereInput = {
      isActive: true,
      ...(categoryId && { categoryId }),
      ...(minDuration && { duration: { gte: minDuration } }),
      ...(maxDuration && { duration: { lte: maxDuration } }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(difficulty && { difficulty }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Build orderBy clause
    let orderBy: Prisma.TourOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sortBy) {
      case 'featured':
        orderBy = { isFeatured: 'desc' };
        break;
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'duration-asc':
        orderBy = { duration: 'asc' };
        break;
      case 'duration-desc':
        orderBy = { duration: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [tours, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              itineraryItems: true,
            },
          },
        },
      }),
      this.prisma.tour.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tours,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(slug: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { slug },
      include: {
        category: true,
        itineraryItems: {
          orderBy: { day: 'asc' },
          include: {
            cities: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        faqs: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!tour) {
      throw new NotFoundException(`Tour with slug "${slug}" not found`);
    }

    // Calculate average rating
    const avgRating = await this.prisma.review.aggregate({
      where: {
        tourId: tour.id,
        isApproved: true,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      ...tour,
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : null,
    };
  }

  async findByCategory(categorySlug: string, query: FindAllToursDto) {
    const category = await this.prisma.tourCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${categorySlug}" not found`);
    }

    return this.findAll({ ...query, categoryId: category.id });
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    try {
      const tour = await this.prisma.tour.update({
        where: { id },
        data: {
          ...updateTourDto,
          ...(updateTourDto.categoryId && {
            category: {
              connect: { id: updateTourDto.categoryId },
            },
          }),
        },
        include: {
          category: true,
        },
      });

      this.logger.log(`Updated tour: ${tour.title} (${tour.id})`);
      return tour;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tour with ID "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Tour with this slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.tour.delete({
        where: { id },
      });

      this.logger.log(`Deleted tour: ${id}`);
      return { message: 'Tour deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tour with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async getFeaturedTours(limit: number = 6) {
    return this.prisma.tour.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }
}
