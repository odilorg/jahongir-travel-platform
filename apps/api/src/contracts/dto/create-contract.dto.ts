import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsIn,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContractRateDto {
  @IsString({ message: 'Supplier type must be a string' })
  @IsIn(['driver', 'guide'], { message: 'Supplier type must be "driver" or "guide"' })
  supplierType: string;

  @IsString({ message: 'Service type must be a string' })
  @IsIn(
    ['airport_transfer', 'half_day', 'full_day', 'multi_day', 'per_km'],
    { message: 'Invalid service type' },
  )
  serviceType: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount must be positive' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'Currency must be a string' })
  @IsIn(['USD', 'UZS'], { message: 'Currency must be USD or UZS' })
  currency?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}

export class CreateContractDto {
  @IsString({ message: 'Company ID must be a string' })
  companyId: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: string;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['active', 'expired', 'pending', 'terminated'], {
    message: 'Status must be active, expired, pending, or terminated',
  })
  status?: string;

  @IsOptional()
  @IsString({ message: 'Terms must be a string' })
  terms?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @IsOptional()
  @IsArray({ message: 'Rates must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ContractRateDto)
  rates?: ContractRateDto[];
}
