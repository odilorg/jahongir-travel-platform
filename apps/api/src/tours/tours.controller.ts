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
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { FindAllToursDto } from './dto/find-all-tours.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Locale } from '../i18n/locale.decorator';
import { Locale as LocaleType } from '@prisma/client';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Get()
  findAll(@Query() query: FindAllToursDto, @Locale() locale: LocaleType) {
    return this.toursService.findAll(query, locale);
  }

  @Get('featured')
  getFeaturedTours(
    @Query('limit') limit?: string,
    @Locale() locale?: LocaleType,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 6;
    return this.toursService.getFeaturedTours(parsedLimit, locale);
  }

  @Get('category/:slug')
  findByCategory(
    @Param('slug') slug: string,
    @Query() query: FindAllToursDto,
    @Locale() locale: LocaleType,
  ) {
    return this.toursService.findByCategory(slug, query, locale);
  }

  @Get('id/:id')
  findById(@Param('id') id: string, @Locale() locale: LocaleType) {
    return this.toursService.findById(id, locale);
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Locale() locale: LocaleType,
  ) {
    return this.toursService.findOne(slug, locale);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }
}
