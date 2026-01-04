import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Locale } from '@prisma/client';

@Injectable()
export class AdminTranslationsService {
  private readonly logger = new Logger(AdminTranslationsService.name);

  constructor(private prisma: PrismaService) {}

  // Tour Translations
  async getTourTranslations(tourId: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id: tourId },
      include: { translations: true },
    });

    if (!tour) {
      throw new NotFoundException(`Tour with ID "${tourId}" not found`);
    }

    return tour.translations;
  }

  async updateTourTranslation(tourId: string, locale: Locale, data: any) {
    // Verify tour exists
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      throw new NotFoundException(`Tour with ID "${tourId}" not found`);
    }

    try {
      const translation = await this.prisma.tourTranslation.upsert({
        where: {
          tourId_locale: {
            tourId,
            locale,
          },
        },
        create: {
          tourId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated tour translation: ${tourId} (${locale}) - ${data.title}`,
      );
      return translation;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Translation with slug "${data.slug}" already exists for locale ${locale}`,
        );
      }
      throw error;
    }
  }

  async deleteTourTranslation(tourId: string, locale: Locale) {
    try {
      await this.prisma.tourTranslation.delete({
        where: {
          tourId_locale: {
            tourId,
            locale,
          },
        },
      });

      this.logger.log(`Deleted tour translation: ${tourId} (${locale})`);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Translation not found for tour ${tourId} in ${locale}`,
        );
      }
      throw error;
    }
  }

  // Blog Post Translations
  async getBlogPostTranslations(postId: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
      include: { translations: true },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID "${postId}" not found`);
    }

    return post.translations;
  }

  async updateBlogPostTranslation(postId: string, locale: Locale, data: any) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException(`Blog post with ID "${postId}" not found`);
    }

    try {
      const translation = await this.prisma.blogPostTranslation.upsert({
        where: {
          postId_locale: {
            postId,
            locale,
          },
        },
        create: {
          postId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated blog post translation: ${postId} (${locale}) - ${data.title}`,
      );
      return translation;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Translation with slug "${data.slug}" already exists for locale ${locale}`,
        );
      }
      throw error;
    }
  }

  async deleteBlogPostTranslation(postId: string, locale: Locale) {
    try {
      await this.prisma.blogPostTranslation.delete({
        where: {
          postId_locale: {
            postId,
            locale,
          },
        },
      });

      this.logger.log(`Deleted blog post translation: ${postId} (${locale})`);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Translation not found for blog post ${postId} in ${locale}`,
        );
      }
      throw error;
    }
  }

  // Category Translations
  async getCategoryTranslations(categoryId: string) {
    const category = await this.prisma.tourCategory.findUnique({
      where: { id: categoryId },
      include: { translations: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID "${categoryId}" not found`,
      );
    }

    return category.translations;
  }

  async updateCategoryTranslation(
    categoryId: string,
    locale: Locale,
    data: any,
  ) {
    const category = await this.prisma.tourCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID "${categoryId}" not found`,
      );
    }

    try {
      const translation = await this.prisma.tourCategoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId,
            locale,
          },
        },
        create: {
          categoryId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated category translation: ${categoryId} (${locale}) - ${data.name}`,
      );
      return translation;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Translation with slug "${data.slug}" already exists for locale ${locale}`,
        );
      }
      throw error;
    }
  }

  async deleteCategoryTranslation(categoryId: string, locale: Locale) {
    try {
      await this.prisma.tourCategoryTranslation.delete({
        where: {
          categoryId_locale: {
            categoryId,
            locale,
          },
        },
      });

      this.logger.log(
        `Deleted category translation: ${categoryId} (${locale})`,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Translation not found for category ${categoryId} in ${locale}`,
        );
      }
      throw error;
    }
  }

  // Blog Category Translations
  async getBlogCategoryTranslations(categoryId: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id: categoryId },
      include: { translations: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Blog category with ID "${categoryId}" not found`,
      );
    }

    return category.translations;
  }

  async updateBlogCategoryTranslation(
    categoryId: string,
    locale: Locale,
    data: any,
  ) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Blog category with ID "${categoryId}" not found`,
      );
    }

    try {
      const translation = await this.prisma.blogCategoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId,
            locale,
          },
        },
        create: {
          categoryId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated blog category translation: ${categoryId} (${locale}) - ${data.name}`,
      );
      return translation;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Translation with slug "${data.slug}" already exists for locale ${locale}`,
        );
      }
      throw error;
    }
  }

  // City Translations
  async getCityTranslations(cityId: string) {
    const city = await this.prisma.city.findUnique({
      where: { id: cityId },
      include: { translations: true },
    });

    if (!city) {
      throw new NotFoundException(`City with ID "${cityId}" not found`);
    }

    return city.translations;
  }

  async updateCityTranslation(cityId: string, locale: Locale, data: any) {
    const city = await this.prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException(`City with ID "${cityId}" not found`);
    }

    try {
      const translation = await this.prisma.cityTranslation.upsert({
        where: {
          cityId_locale: {
            cityId,
            locale,
          },
        },
        create: {
          cityId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated city translation: ${cityId} (${locale}) - ${data.name}`,
      );
      return translation;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Translation with slug "${data.slug}" already exists for locale ${locale}`,
        );
      }
      throw error;
    }
  }

  // Itinerary Item Translations
  async getItineraryItemTranslations(itemId: string) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: { translations: true },
    });

    if (!item) {
      throw new NotFoundException(
        `Itinerary item with ID "${itemId}" not found`,
      );
    }

    return item.translations;
  }

  async updateItineraryItemTranslation(
    itemId: string,
    locale: Locale,
    data: any,
  ) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException(
        `Itinerary item with ID "${itemId}" not found`,
      );
    }

    try {
      const translation =
        await this.prisma.itineraryItemTranslation.upsert({
          where: {
            itemId_locale: {
              itemId,
              locale,
            },
          },
          create: {
            itemId,
            locale,
            ...data,
          },
          update: data,
        });

      this.logger.log(
        `Updated itinerary item translation: ${itemId} (${locale}) - ${data.title}`,
      );
      return translation;
    } catch (error) {
      throw error;
    }
  }

  // Tour FAQ Translations
  async getTourFaqTranslations(faqId: string) {
    const faq = await this.prisma.tourFaq.findUnique({
      where: { id: faqId },
      include: { translations: true },
    });

    if (!faq) {
      throw new NotFoundException(`Tour FAQ with ID "${faqId}" not found`);
    }

    return faq.translations;
  }

  async updateTourFaqTranslation(faqId: string, locale: Locale, data: any) {
    const faq = await this.prisma.tourFaq.findUnique({ where: { id: faqId } });
    if (!faq) {
      throw new NotFoundException(`Tour FAQ with ID "${faqId}" not found`);
    }

    try {
      const translation = await this.prisma.tourFaqTranslation.upsert({
        where: {
          faqId_locale: {
            faqId,
            locale,
          },
        },
        create: {
          faqId,
          locale,
          ...data,
        },
        update: data,
      });

      this.logger.log(
        `Updated tour FAQ translation: ${faqId} (${locale}) - ${data.question}`,
      );
      return translation;
    } catch (error) {
      throw error;
    }
  }
}
