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
import { Throttle } from '@nestjs/throttler';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  UpdateBookingDto,
  UpdateBookingStatusDto,
  UpdatePaymentStatusDto,
} from './dto/update-booking.dto';
import { AssignGuideDto, AssignDriverDto } from './dto/assign-staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a new booking (public endpoint, rate-limited)
   * POST /bookings
   * Limit: 5 bookings per minute per IP
   */
  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  /**
   * Get all bookings with filtering and pagination (admin only)
   * GET /bookings?status=pending&page=1&limit=20
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('tourId') tourId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.bookingsService.findAll({
      status,
      paymentStatus,
      tourId,
      page,
      limit,
    });
  }

  /**
   * Get booking statistics (admin only)
   * GET /bookings/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.bookingsService.getStats();
  }

  /**
   * Get booking by ID (admin only)
   * GET /bookings/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  /**
   * Update booking details (admin only)
   * PATCH /bookings/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateDto);
  }

  /**
   * Update booking status (admin only)
   * PATCH /bookings/:id/status
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateDto);
  }

  /**
   * Update payment status (admin only)
   * PATCH /bookings/:id/payment
   */
  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentStatusDto,
  ) {
    return this.bookingsService.updatePaymentStatus(id, updateDto);
  }

  /**
   * Delete booking (admin only)
   * DELETE /bookings/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  // ============================================================================
  // GUIDE & DRIVER ASSIGNMENT ENDPOINTS
  // ============================================================================

  /**
   * Get booking with assigned staff
   * GET /bookings/:id/staff
   */
  @Get(':id/staff')
  @UseGuards(JwtAuthGuard)
  getBookingWithStaff(@Param('id') id: string) {
    return this.bookingsService.getBookingWithStaff(id);
  }

  /**
   * Assign guide to booking
   * POST /bookings/:id/guides
   */
  @Post(':id/guides')
  @UseGuards(JwtAuthGuard)
  assignGuide(
    @Param('id') id: string,
    @Body() assignGuideDto: AssignGuideDto,
  ) {
    return this.bookingsService.assignGuide(id, assignGuideDto.guideId, assignGuideDto.role);
  }

  /**
   * Remove guide from booking
   * DELETE /bookings/:id/guides/:guideId
   */
  @Delete(':id/guides/:guideId')
  @UseGuards(JwtAuthGuard)
  removeGuide(
    @Param('id') id: string,
    @Param('guideId') guideId: string,
  ) {
    return this.bookingsService.removeGuide(id, guideId);
  }

  /**
   * Assign driver to booking
   * POST /bookings/:id/drivers
   */
  @Post(':id/drivers')
  @UseGuards(JwtAuthGuard)
  assignDriver(
    @Param('id') id: string,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    return this.bookingsService.assignDriver(id, assignDriverDto.driverId, assignDriverDto.vehicleId);
  }

  /**
   * Remove driver from booking
   * DELETE /bookings/:id/drivers/:driverId
   */
  @Delete(':id/drivers/:driverId')
  @UseGuards(JwtAuthGuard)
  removeDriver(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ) {
    return this.bookingsService.removeDriver(id, driverId);
  }
}
