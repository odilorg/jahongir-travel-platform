import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
} from 'class-validator';

export class CreateGuideRateDto {
  @IsString({ message: 'Service type must be a string' })
  @IsIn(
    ['half_day', 'full_day', 'multi_day'],
    { message: 'Invalid service type for guide' },
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
