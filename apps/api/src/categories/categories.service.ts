import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.tourCategory.create({
        data: createCategoryDto,
      });

      this.logger.log(`Created category: ${category.name} (${category.id})`);
      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Category with this slug already exists',
        );
      }
      throw error;
    }
  }

  async findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };

    const categories = await this.prisma.tourCategory.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            tours: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return categories;
  }

  async findOne(slug: string) {
    const category = await this.prisma.tourCategory.findUnique({
      where: { slug },
      include: {
        tours: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        },
        _count: {
          select: {
            tours: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.tourCategory.update({
        where: { id },
        data: updateCategoryDto,
      });

      this.logger.log(`Updated category: ${category.name} (${category.id})`);
      return category;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Category with this slug already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check if category has tours
      const category = await this.prisma.tourCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { tours: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      if (category._count.tours > 0) {
        throw new BadRequestException(
          `Cannot delete category with ${category._count.tours} associated tours`,
        );
      }

      await this.prisma.tourCategory.delete({
        where: { id },
      });

      this.logger.log(`Deleted category: ${id}`);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async getPopular(limit: number = 6) {
    const categories = await this.prisma.tourCategory.findMany({
      where: { isActive: true },
      orderBy: {
        tours: {
          _count: 'desc',
        },
      },
      take: limit,
      include: {
        _count: {
          select: {
            tours: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return categories;
  }
}
