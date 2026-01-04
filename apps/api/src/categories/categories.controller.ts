import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Locale } from '../i18n/locale.decorator';
import { Locale as LocaleType } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string, @Locale() locale?: LocaleType) {
    return this.categoriesService.findAll(includeInactive === 'true', locale);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string, @Locale() locale?: LocaleType) {
    const parsedLimit = limit ? parseInt(limit, 10) : 6;
    return this.categoriesService.getPopular(parsedLimit, locale);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Locale() locale?: LocaleType) {
    return this.categoriesService.findOne(slug, locale);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
