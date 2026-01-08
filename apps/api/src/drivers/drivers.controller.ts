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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverRateDto } from './dto/driver-rate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  /**
   * Create a new driver
   * POST /drivers
   */
  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  /**
   * Get all drivers with filtering and pagination
   * GET /drivers?search=name&language=en&isActive=true&companyId=xxx&freelancersOnly=true&page=1&limit=20
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
    return this.driversService.findAll({
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
   * Get driver statistics
   * GET /drivers/stats
   */
  @Get('stats')
  getStats() {
    return this.driversService.getStats();
  }

  /**
   * Get driver by ID with booking history
   * GET /drivers/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  /**
   * Update driver
   * PATCH /drivers/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  /**
   * Delete (deactivate) driver
   * DELETE /drivers/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }

  // ==================== Rate Management ====================

  /**
   * Get all rates for a driver
   * GET /drivers/:id/rates
   */
  @Get(':id/rates')
  getRates(@Param('id') id: string) {
    return this.driversService.getRates(id);
  }

  /**
   * Create or update a rate for a driver
   * POST /drivers/:id/rates
   */
  @Post(':id/rates')
  upsertRate(@Param('id') id: string, @Body() rateDto: CreateDriverRateDto) {
    return this.driversService.upsertRate(id, rateDto);
  }

  /**
   * Delete a rate for a driver
   * DELETE /drivers/:id/rates/:rateId
   */
  @Delete(':id/rates/:rateId')
  deleteRate(@Param('id') id: string, @Param('rateId') rateId: string) {
    return this.driversService.deleteRate(id, rateId);
  }
}
