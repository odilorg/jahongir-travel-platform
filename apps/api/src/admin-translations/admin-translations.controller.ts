import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminTranslationsService } from './admin-translations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Locale } from '@prisma/client';

// DTOs for translation updates
class TourTranslationDto {
  title: string;
  slug: string;
  summary?: string;
  description: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

class BlogPostTranslationDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

class CategoryTranslationDto {
  name: string;
  slug: string;
  description?: string;
}

class CityTranslationDto {
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

class ItineraryItemTranslationDto {
  title: string;
  description: string;
  activities?: string[];
}

class TourFaqTranslationDto {
  question: string;
  answer: string;
}

class BlogCategoryTranslationDto {
  name: string;
  slug: string;
  description?: string;
}

@Controller('admin/translations')
@UseGuards(JwtAuthGuard)
export class AdminTranslationsController {
  constructor(
    private readonly translationsService: AdminTranslationsService,
  ) {}

  // Tour Translations
  @Get('tours/:id')
  getTourTranslations(@Param('id') id: string) {
    return this.translationsService.getTourTranslations(id);
  }

  @Put('tours/:id/:locale')
  updateTourTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: TourTranslationDto,
  ) {
    return this.translationsService.updateTourTranslation(id, locale, data);
  }

  @Delete('tours/:id/:locale')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTourTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
  ) {
    return this.translationsService.deleteTourTranslation(id, locale);
  }

  // Blog Post Translations
  @Get('blog/:id')
  getBlogPostTranslations(@Param('id') id: string) {
    return this.translationsService.getBlogPostTranslations(id);
  }

  @Put('blog/:id/:locale')
  updateBlogPostTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: BlogPostTranslationDto,
  ) {
    return this.translationsService.updateBlogPostTranslation(id, locale, data);
  }

  @Delete('blog/:id/:locale')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBlogPostTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
  ) {
    return this.translationsService.deleteBlogPostTranslation(id, locale);
  }

  // Category Translations
  @Get('categories/:id')
  getCategoryTranslations(@Param('id') id: string) {
    return this.translationsService.getCategoryTranslations(id);
  }

  @Put('categories/:id/:locale')
  updateCategoryTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: CategoryTranslationDto,
  ) {
    return this.translationsService.updateCategoryTranslation(id, locale, data);
  }

  @Delete('categories/:id/:locale')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategoryTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
  ) {
    return this.translationsService.deleteCategoryTranslation(id, locale);
  }

  // Blog Category Translations
  @Get('blog-categories/:id')
  getBlogCategoryTranslations(@Param('id') id: string) {
    return this.translationsService.getBlogCategoryTranslations(id);
  }

  @Put('blog-categories/:id/:locale')
  updateBlogCategoryTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: BlogCategoryTranslationDto,
  ) {
    return this.translationsService.updateBlogCategoryTranslation(
      id,
      locale,
      data,
    );
  }

  // City Translations
  @Get('cities/:id')
  getCityTranslations(@Param('id') id: string) {
    return this.translationsService.getCityTranslations(id);
  }

  @Put('cities/:id/:locale')
  updateCityTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: CityTranslationDto,
  ) {
    return this.translationsService.updateCityTranslation(id, locale, data);
  }

  // Itinerary Item Translations
  @Get('itinerary/:id')
  getItineraryItemTranslations(@Param('id') id: string) {
    return this.translationsService.getItineraryItemTranslations(id);
  }

  @Put('itinerary/:id/:locale')
  updateItineraryItemTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: ItineraryItemTranslationDto,
  ) {
    return this.translationsService.updateItineraryItemTranslation(
      id,
      locale,
      data,
    );
  }

  // Tour FAQ Translations
  @Get('tour-faq/:id')
  getTourFaqTranslations(@Param('id') id: string) {
    return this.translationsService.getTourFaqTranslations(id);
  }

  @Put('tour-faq/:id/:locale')
  updateTourFaqTranslation(
    @Param('id') id: string,
    @Param('locale') locale: Locale,
    @Body() data: TourFaqTranslationDto,
  ) {
    return this.translationsService.updateTourFaqTranslation(id, locale, data);
  }
}
