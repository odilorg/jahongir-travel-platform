import { Module } from '@nestjs/common';
import { SupplierCompaniesService } from './supplier-companies.service';
import { SupplierCompaniesController } from './supplier-companies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierCompaniesController],
  providers: [SupplierCompaniesService],
  exports: [SupplierCompaniesService],
})
export class SupplierCompaniesModule {}
