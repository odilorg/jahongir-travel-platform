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
import { Prisma, Locale } from '@prisma/client';
import {
  getTranslationWithFallback,
  logMissingTranslation,
  DEFAULT_LOCALE,
} from '../i18n';

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  constructor(private prisma: PrismaService) {}

  async create(createTourDto: CreateTourDto) {
    try {
      const { categoryId, ...tourData } = createTourDto;
      const tour = await this.prisma.tour.create({
        data: {
          ...tourData,
          category: {
            connect: { id: categoryId },
          },
        },
        include: {
          category: true,
          translations: true,
        },
      });

      const translation = tour.translations[0];
      this.logger.log(`Created tour: ${translation?.title || tour.id} (${tour.id})`);
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

  async findAll(query: FindAllToursDto, locale: Locale = DEFAULT_LOCALE) {
    const { page = 1, limit = 20, categoryId, minDuration, maxDuration, minPrice, maxPrice, difficulty, search, sortBy, featured } = query;

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
        translations: {
          some: {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { summary: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
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
    const skip = ((page ?? 1) - 1) * (limit ?? 20);

    const [tours, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          translations: {
            where: {
              locale: {
                in: [locale, DEFAULT_LOCALE],
              },
            },
          },
          category: {
            include: {
              translations: {
                where: {
                  locale: {
                    in: [locale, DEFAULT_LOCALE],
                  },
                },
              },
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

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 20;
    const totalPages = Math.ceil(total / currentLimit);

    // Flatten translations into tour objects
    const data = tours.map((tour) => {
      const translation = getTranslationWithFallback(tour.translations, locale);
      const categoryTranslation = getTranslationWithFallback(
        tour.category.translations,
        locale,
      );

      if (!translation) {
        logMissingTranslation(
          'Tour',
          tour.id,
          locale,
          tour.translations.map((t) => t.locale),
        );
      }

      return {
        id: tour.id,
        price: tour.price,
        duration: tour.duration,
        maxGroupSize: tour.maxGroupSize,
        difficulty: tour.difficulty,
        images: tour.images,
        showPrice: tour.showPrice,
        discountedPrice: tour.discountedPrice,
        isActive: tour.isActive,
        isFeatured: tour.isFeatured,
        createdAt: tour.createdAt,
        updatedAt: tour.updatedAt,
        // Flattened translation fields
        title: translation?.title || '',
        slug: translation?.slug || '',
        summary: translation?.summary || null,
        description: translation?.description || '',
        highlights: translation?.highlights || [],
        included: translation?.included || [],
        excluded: translation?.excluded || [],
        metaTitle: translation?.metaTitle || null,
        metaDescription: translation?.metaDescription || null,
        // Category with flattened translation
        category: {
          id: tour.category.id,
          icon: tour.category.icon,
          name: categoryTranslation?.name || '',
          slug: categoryTranslation?.slug || '',
          description: categoryTranslation?.description || null,
        },
        _count: tour._count,
      };
    });

    return {
      data,
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  async findById(id: string, locale: Locale = DEFAULT_LOCALE) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            locale: {
              in: [locale, DEFAULT_LOCALE],
            },
          },
        },
        category: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
        },
        itineraryItems: {
          orderBy: { day: 'asc' },
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
            cities: {
              include: {
                translations: {
                  where: {
                    locale: {
                      in: [locale, DEFAULT_LOCALE],
                    },
                  },
                },
              },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        faqs: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
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
      throw new NotFoundException(`Tour with ID "${id}" not found`);
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

    // Flatten tour translations
    const translation = getTranslationWithFallback(tour.translations, locale);
    const categoryTranslation = getTranslationWithFallback(
      tour.category.translations,
      locale,
    );

    if (!translation) {
      logMissingTranslation(
        'Tour',
        tour.id,
        locale,
        tour.translations.map((t) => t.locale),
      );
    }

    // Flatten itinerary translations
    const itineraryItems = tour.itineraryItems.map((item) => {
      const itemTranslation = getTranslationWithFallback(
        item.translations,
        locale,
      );

      if (!itemTranslation) {
        logMissingTranslation(
          'ItineraryItem',
          item.id,
          locale,
          item.translations.map((t) => t.locale),
        );
      }

      return {
        id: item.id,
        day: item.day,
        accommodation: item.accommodation,
        meals: item.meals,
        title: itemTranslation?.title || '',
        description: itemTranslation?.description || '',
        cities: item.cities.map((city) => {
          const cityTranslation = getTranslationWithFallback(
            city.translations,
            locale,
          );
          return {
            id: city.id,
            name: cityTranslation?.name || '',
            slug: cityTranslation?.slug || '',
          };
        }),
      };
    });

    // Flatten FAQ translations
    const faqs = tour.faqs.map((faq) => {
      const faqTranslation = getTranslationWithFallback(faq.translations, locale);

      if (!faqTranslation) {
        logMissingTranslation(
          'TourFaq',
          faq.id,
          locale,
          faq.translations.map((t) => t.locale),
        );
      }

      return {
        id: faq.id,
        order: faq.order,
        question: faqTranslation?.question || '',
        answer: faqTranslation?.answer || '',
      };
    });

    return {
      id: tour.id,
      price: tour.price,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
      difficulty: tour.difficulty,
      images: tour.images,
      showPrice: tour.showPrice,
      discountedPrice: tour.discountedPrice,
      isActive: tour.isActive,
      isFeatured: tour.isFeatured,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
      // Flattened translation fields
      title: translation?.title || '',
      slug: translation?.slug || '',
      summary: translation?.summary || null,
      description: translation?.description || '',
      highlights: translation?.highlights || [],
      included: translation?.included || [],
      excluded: translation?.excluded || [],
      metaTitle: translation?.metaTitle || null,
      metaDescription: translation?.metaDescription || null,
      // Category with flattened translation
      category: {
        id: tour.category.id,
        icon: tour.category.icon,
        name: categoryTranslation?.name || '',
        slug: categoryTranslation?.slug || '',
        description: categoryTranslation?.description || null,
      },
      itineraryItems,
      reviews: tour.reviews,
      faqs,
      _count: tour._count,
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : null,
    };
  }

  async findOne(slug: string, locale: Locale = DEFAULT_LOCALE) {
    const tour = await this.prisma.tour.findFirst({
      where: {
        translations: {
          some: {
            slug,
            locale,
          },
        },
      },
      include: {
        translations: {
          where: {
            locale: {
              in: [locale, DEFAULT_LOCALE],
            },
          },
        },
        category: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
        },
        itineraryItems: {
          orderBy: { day: 'asc' },
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
            cities: {
              include: {
                translations: {
                  where: {
                    locale: {
                      in: [locale, DEFAULT_LOCALE],
                    },
                  },
                },
              },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        faqs: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
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

    // Flatten tour translations
    const translation = getTranslationWithFallback(tour.translations, locale);
    const categoryTranslation = getTranslationWithFallback(
      tour.category.translations,
      locale,
    );

    if (!translation) {
      logMissingTranslation(
        'Tour',
        tour.id,
        locale,
        tour.translations.map((t) => t.locale),
      );
    }

    // Flatten itinerary translations
    const itineraryItems = tour.itineraryItems.map((item) => {
      const itemTranslation = getTranslationWithFallback(
        item.translations,
        locale,
      );

      if (!itemTranslation) {
        logMissingTranslation(
          'ItineraryItem',
          item.id,
          locale,
          item.translations.map((t) => t.locale),
        );
      }

      return {
        id: item.id,
        day: item.day,
        accommodation: item.accommodation,
        meals: item.meals,
        title: itemTranslation?.title || '',
        description: itemTranslation?.description || '',
        cities: item.cities.map((city) => {
          const cityTranslation = getTranslationWithFallback(
            city.translations,
            locale,
          );
          return {
            id: city.id,
            name: cityTranslation?.name || '',
            slug: cityTranslation?.slug || '',
          };
        }),
      };
    });

    // Flatten FAQ translations
    const faqs = tour.faqs.map((faq) => {
      const faqTranslation = getTranslationWithFallback(faq.translations, locale);

      if (!faqTranslation) {
        logMissingTranslation(
          'TourFaq',
          faq.id,
          locale,
          faq.translations.map((t) => t.locale),
        );
      }

      return {
        id: faq.id,
        order: faq.order,
        question: faqTranslation?.question || '',
        answer: faqTranslation?.answer || '',
      };
    });

    return {
      id: tour.id,
      price: tour.price,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
      difficulty: tour.difficulty,
      images: tour.images,
      showPrice: tour.showPrice,
      discountedPrice: tour.discountedPrice,
      isActive: tour.isActive,
      isFeatured: tour.isFeatured,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
      // Flattened translation fields
      title: translation?.title || '',
      slug: translation?.slug || '',
      summary: translation?.summary || null,
      description: translation?.description || '',
      highlights: translation?.highlights || [],
      included: translation?.included || [],
      excluded: translation?.excluded || [],
      metaTitle: translation?.metaTitle || null,
      metaDescription: translation?.metaDescription || null,
      // Category with flattened translation
      category: {
        id: tour.category.id,
        icon: tour.category.icon,
        name: categoryTranslation?.name || '',
        slug: categoryTranslation?.slug || '',
        description: categoryTranslation?.description || null,
      },
      itineraryItems,
      reviews: tour.reviews,
      faqs,
      _count: tour._count,
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : null,
    };
  }

  async findByCategory(categorySlug: string, query: FindAllToursDto, locale: Locale = DEFAULT_LOCALE) {
    const category = await this.prisma.tourCategory.findFirst({
      where: {
        translations: {
          some: {
            slug: categorySlug,
            locale,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${categorySlug}" not found`);
    }

    return this.findAll({ ...query, categoryId: category.id }, locale);
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    try {
      const { categoryId, ...updateData } = updateTourDto;
      const tour = await this.prisma.tour.update({
        where: { id },
        data: {
          ...updateData,
          ...(categoryId && {
            category: {
              connect: { id: categoryId },
            },
          }),
        },
        include: {
          category: true,
          translations: true,
        },
      });

      const translation = tour.translations[0];
      this.logger.log(`Updated tour: ${translation?.title || tour.id} (${tour.id})`);
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

  async getFeaturedTours(limit: number = 6, locale: Locale = DEFAULT_LOCALE) {
    const tours = await this.prisma.tour.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: {
        createdAt: 'desc',
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
        category: {
          include: {
            translations: {
              where: {
                locale: {
                  in: [locale, DEFAULT_LOCALE],
                },
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Flatten translations
    return tours.map((tour) => {
      const translation = getTranslationWithFallback(tour.translations, locale);
      const categoryTranslation = getTranslationWithFallback(
        tour.category.translations,
        locale,
      );

      if (!translation) {
        logMissingTranslation(
          'Tour',
          tour.id,
          locale,
          tour.translations.map((t) => t.locale),
        );
      }

      return {
        id: tour.id,
        price: tour.price,
        duration: tour.duration,
        maxGroupSize: tour.maxGroupSize,
        difficulty: tour.difficulty,
        images: tour.images,
        showPrice: tour.showPrice,
        discountedPrice: tour.discountedPrice,
        isFeatured: tour.isFeatured,
        // Flattened translation fields
        title: translation?.title || '',
        slug: translation?.slug || '',
        summary: translation?.summary || null,
        description: translation?.description || '',
        // Category with flattened translation
        category: {
          id: tour.category.id,
          icon: tour.category.icon,
          name: categoryTranslation?.name || '',
          slug: categoryTranslation?.slug || '',
        },
        _count: tour._count,
      };
    });
  }
}
