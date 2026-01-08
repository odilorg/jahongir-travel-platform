import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SupplierCompaniesService } from './supplier-companies.service';
import { CreateSupplierCompanyDto } from './dto/create-supplier-company.dto';
import { UpdateSupplierCompanyDto } from './dto/update-supplier-company.dto';

@Controller('supplier-companies')
export class SupplierCompaniesController {
  constructor(private readonly supplierCompaniesService: SupplierCompaniesService) {}

  @Post()
  create(@Body() createSupplierCompanyDto: CreateSupplierCompanyDto) {
    return this.supplierCompaniesService.create(createSupplierCompanyDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.supplierCompaniesService.findAll({
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('stats')
  getStats() {
    return this.supplierCompaniesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierCompaniesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierCompanyDto: UpdateSupplierCompanyDto,
  ) {
    return this.supplierCompaniesService.update(id, updateSupplierCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierCompaniesService.remove(id);
  }
}
