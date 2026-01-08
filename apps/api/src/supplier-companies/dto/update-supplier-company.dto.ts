import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierCompanyDto } from './create-supplier-company.dto';

export class UpdateSupplierCompanyDto extends PartialType(CreateSupplierCompanyDto) {}
