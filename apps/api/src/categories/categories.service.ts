import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Locale } from '@prisma/client';
import {
  getTranslationWithFallback,
  logMissingTranslation,
  DEFAULT_LOCALE,
} from '../i18n';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.tourCategory.create({
        data: createCategoryDto,
        include: {
          translations: true,
        },
      });

      const firstTranslation = category.translations[0];
      this.logger.log(`Created category: ${firstTranslation?.name || category.id} (${category.id})`);
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

  async findAll(includeInactive: boolean = false, locale: Locale = DEFAULT_LOCALE) {
    const where = includeInactive ? {} : { isActive: true };

    const categories = await this.prisma.tourCategory.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        translations: {
          where: {
            locale: {
              in: [locale, DEFAULT_LOCALE],
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

    // Flatten translations
    return categories.map((category) => {
      const translation = getTranslationWithFallback(category.translations, locale);

      if (!translation) {
        logMissingTranslation(
          'TourCategory',
          category.id,
          locale,
          category.translations.map((t) => t.locale),
        );
      }

      return {
        id: category.id,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        // Flattened translation fields
        name: translation?.name || '',
        slug: translation?.slug || '',
        description: translation?.description || null,
        _count: category._count,
      };
    });
  }

  async findOne(slug: string, locale: Locale = DEFAULT_LOCALE) {
    // First find category by localized slug
    const categoryTranslation = await this.prisma.tourCategoryTranslation.findFirst({
      where: { slug },
      include: {
        category: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
            tours: {
              where: { isActive: true },
              take: 10,
              orderBy: { createdAt: 'desc' },
              include: {
                translations: {
                  where: {
                    locale: {
                      in: [locale, DEFAULT_LOCALE],
                    },
                  },
                },
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
        },
      },
    });

    if (!categoryTranslation?.category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    const category = categoryTranslation.category;
    const translation = getTranslationWithFallback(category.translations, locale);

    if (!translation) {
      logMissingTranslation(
        'TourCategory',
        category.id,
        locale,
        category.translations.map((t) => t.locale),
      );
    }

    // Flatten tour translations
    const tours = category.tours.map((tour) => {
      const tourTranslation = getTranslationWithFallback(tour.translations, locale);

      return {
        id: tour.id,
        price: tour.price,
        duration: tour.duration,
        images: tour.images,
        isFeatured: tour.isFeatured,
        createdAt: tour.createdAt,
        // Flattened translation fields
        title: tourTranslation?.title || '',
        slug: tourTranslation?.slug || '',
        summary: tourTranslation?.summary || null,
        _count: tour._count,
      };
    });

    return {
      id: category.id,
      icon: category.icon,
      order: category.order,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      // Flattened translation fields
      name: translation?.name || '',
      slug: translation?.slug || '',
      description: translation?.description || null,
      tours,
      _count: category._count,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.tourCategory.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          translations: true,
        },
      });

      const firstTranslation = category.translations[0];
      this.logger.log(`Updated category: ${firstTranslation?.name || category.id} (${category.id})`);
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

  async getPopular(limit: number = 6, locale: Locale = DEFAULT_LOCALE) {
    const categories = await this.prisma.tourCategory.findMany({
      where: { isActive: true },
      orderBy: {
        tours: {
          _count: 'desc',
        },
      },
      take: limit,
      include: {
        translations: {
          where: {
            locale: {
              in: [locale, DEFAULT_LOCALE],
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

    // Flatten translations
    return categories.map((category) => {
      const translation = getTranslationWithFallback(category.translations, locale);

      if (!translation) {
        logMissingTranslation(
          'TourCategory',
          category.id,
          locale,
          category.translations.map((t) => t.locale),
        );
      }

      return {
        id: category.id,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        // Flattened translation fields
        name: translation?.name || '',
        slug: translation?.slug || '',
        description: translation?.description || null,
        _count: category._count,
      };
    });
  }
}
