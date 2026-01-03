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
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { FindGuestsDto } from './dto/find-guests.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('guests')
@UseGuards(JwtAuthGuard)
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  /**
   * Create a new guest manually (admin only)
   * POST /guests
   */
  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  /**
   * Get all guests with search and pagination (admin only)
   * GET /guests?search=john&page=1&limit=20&sortBy=createdAt&sortOrder=desc
   */
  @Get()
  findAll(@Query() query: FindGuestsDto) {
    return this.guestsService.findAll(query);
  }

  /**
   * Get guest statistics (admin only)
   * GET /guests/stats
   */
  @Get('stats')
  getStats() {
    return this.guestsService.getStats();
  }

  /**
   * Get guest by ID with booking history (admin only)
   * GET /guests/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  /**
   * Update guest (admin only)
   * PATCH /guests/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(id, updateGuestDto);
  }

  /**
   * Delete guest (admin only)
   * DELETE /guests/:id
   * Note: Only allowed if guest has no bookings
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(id);
  }
}
