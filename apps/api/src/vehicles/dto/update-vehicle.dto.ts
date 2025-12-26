import { IsString, IsOptional, IsInt, IsIn, IsBoolean } from 'class-validator';

export class UpdateVehicleDto {
  @IsString({ message: 'Plate number must be a string' })
  @IsOptional()
  plateNumber?: string;

  @IsString({ message: 'Make must be a string' })
  @IsOptional()
  make?: string;

  @IsString({ message: 'Model must be a string' })
  @IsOptional()
  model?: string;

  @IsInt({ message: 'Year must be a number' })
  @IsOptional()
  year?: number;

  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  color?: string;

  @IsInt({ message: 'Capacity must be a number' })
  @IsOptional()
  capacity?: number;

  @IsString({ message: 'Type must be a string' })
  @IsIn(['sedan', 'minivan', 'suv', 'bus', 'van'], { message: 'Type must be: sedan, minivan, suv, bus, or van' })
  @IsOptional()
  type?: string;

  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  notes?: string;

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}
