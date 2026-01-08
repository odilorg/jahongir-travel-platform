import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { GuidesService } from './guides.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { CreateGuideRateDto } from './dto/guide-rate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('guides')
@UseGuards(JwtAuthGuard)
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  /**
   * Create a new guide
   * POST /guides
   */
  @Post()
  create(@Body() createGuideDto: CreateGuideDto) {
    return this.guidesService.create(createGuideDto);
  }

  /**
   * Get all guides with filtering and pagination
   * GET /guides?search=name&language=en&isActive=true&companyId=xxx&freelancersOnly=true&page=1&limit=20
   */
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('language') language?: string,
    @Query('isActive') isActive?: string,
    @Query('companyId') companyId?: string,
    @Query('freelancersOnly') freelancersOnly?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.guidesService.findAll({
      search,
      language,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      companyId,
      freelancersOnly: freelancersOnly === 'true',
      page,
      limit,
    });
  }

  /**
   * Get guide statistics
   * GET /guides/stats
   */
  @Get('stats')
  getStats() {
    return this.guidesService.getStats();
  }

  /**
   * Get guide by ID with booking history
   * GET /guides/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  /**
   * Update guide
   * PATCH /guides/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guidesService.update(id, updateGuideDto);
  }

  /**
   * Delete (deactivate) guide
   * DELETE /guides/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guidesService.remove(id);
  }

  // ==================== Rate Management ====================

  /**
   * Get all rates for a guide
   * GET /guides/:id/rates
   */
  @Get(':id/rates')
  getRates(@Param('id') id: string) {
    return this.guidesService.getRates(id);
  }

  /**
   * Create or update a rate for a guide
   * POST /guides/:id/rates
   */
  @Post(':id/rates')
  upsertRate(@Param('id') id: string, @Body() rateDto: CreateGuideRateDto) {
    return this.guidesService.upsertRate(id, rateDto);
  }

  /**
   * Delete a rate for a guide
   * DELETE /guides/:id/rates/:rateId
   */
  @Delete(':id/rates/:rateId')
  deleteRate(@Param('id') id: string, @Param('rateId') rateId: string) {
    return this.guidesService.deleteRate(id, rateId);
  }
}
