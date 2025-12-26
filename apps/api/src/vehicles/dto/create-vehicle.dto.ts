import { IsString, IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';

export class CreateVehicleDto {
  @IsString({ message: 'Driver ID must be a string' })
  driverId: string;

  @IsString({ message: 'Plate number must be a string' })
  plateNumber: string;

  @IsString({ message: 'Make must be a string' })
  make: string;

  @IsString({ message: 'Model must be a string' })
  model: string;

  @IsOptional()
  @IsInt({ message: 'Year must be a number' })
  @Min(1990)
  @Max(2030)
  year?: number;

  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  color?: string;

  @IsOptional()
  @IsInt({ message: 'Capacity must be a number' })
  @Min(1)
  @Max(50)
  capacity?: number;

  @IsOptional()
  @IsIn(['sedan', 'minivan', 'suv', 'bus', 'van'], { message: 'Type must be: sedan, minivan, suv, bus, or van' })
  type?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
