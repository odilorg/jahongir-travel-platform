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
import { CreateTourDepartureDto, UpdateTourDepartureDto } from './dto/tour-departure.dto';
import { CreateTourPricingTierDto, UpdateTourPricingTierDto } from './dto/tour-pricing-tier.dto';
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

  // ============================================================================
  // DEPARTURES ENDPOINTS
  // ============================================================================

  @Get(':tourId/departures')
  getDepartures(
    @Param('tourId') tourId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.toursService.getDepartures(tourId, includeInactive === 'true');
  }

  @Post(':tourId/departures')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createDeparture(
    @Param('tourId') tourId: string,
    @Body() dto: CreateTourDepartureDto,
  ) {
    return this.toursService.createDeparture(tourId, {
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      maxSpots: dto.maxSpots,
      spotsRemaining: dto.spotsRemaining,
      status: dto.status,
      priceModifier: dto.priceModifier,
      isGuaranteed: dto.isGuaranteed,
      isActive: dto.isActive,
    });
  }

  @Patch('departures/:id')
  @UseGuards(JwtAuthGuard)
  updateDeparture(
    @Param('id') id: string,
    @Body() dto: UpdateTourDepartureDto,
  ) {
    return this.toursService.updateDeparture(id, {
      ...(dto.startDate && { startDate: new Date(dto.startDate) }),
      ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      ...(dto.maxSpots !== undefined && { maxSpots: dto.maxSpots }),
      ...(dto.spotsRemaining !== undefined && { spotsRemaining: dto.spotsRemaining }),
      ...(dto.status && { status: dto.status }),
      ...(dto.priceModifier !== undefined && { priceModifier: dto.priceModifier }),
      ...(dto.isGuaranteed !== undefined && { isGuaranteed: dto.isGuaranteed }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });
  }

  @Delete('departures/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteDeparture(@Param('id') id: string) {
    return this.toursService.deleteDeparture(id);
  }

  // ============================================================================
  // PRICING TIERS ENDPOINTS
  // ============================================================================

  @Get(':tourId/pricing-tiers')
  getPricingTiers(
    @Param('tourId') tourId: string,
    @Locale() locale: LocaleType,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.toursService.getPricingTiers(tourId, locale, includeInactive === 'true');
  }

  @Post(':tourId/pricing-tiers')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createPricingTier(
    @Param('tourId') tourId: string,
    @Body() dto: CreateTourPricingTierDto,
  ) {
    return this.toursService.createPricingTier(tourId, {
      minGuests: dto.minGuests,
      maxGuests: dto.maxGuests,
      pricePerPerson: dto.pricePerPerson,
      order: dto.order,
      isActive: dto.isActive,
      translations: dto.translations,
    });
  }

  @Patch('pricing-tiers/:id')
  @UseGuards(JwtAuthGuard)
  updatePricingTier(
    @Param('id') id: string,
    @Body() dto: UpdateTourPricingTierDto,
  ) {
    return this.toursService.updatePricingTier(id, {
      ...(dto.minGuests !== undefined && { minGuests: dto.minGuests }),
      ...(dto.maxGuests !== undefined && { maxGuests: dto.maxGuests }),
      ...(dto.pricePerPerson !== undefined && { pricePerPerson: dto.pricePerPerson }),
      ...(dto.order !== undefined && { order: dto.order }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.translations && { translations: dto.translations }),
    });
  }

  @Delete('pricing-tiers/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePricingTier(@Param('id') id: string) {
    return this.toursService.deletePricingTier(id);
  }
}
