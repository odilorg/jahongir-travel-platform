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
   * GET /guides?search=name&language=en&isActive=true&page=1&limit=20
   */
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('language') language?: string,
    @Query('isActive') isActive?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.guidesService.findAll({
      search,
      language,
      isActive: isActive === undefined ? undefined : isActive === 'true',
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
}
