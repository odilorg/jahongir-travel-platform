import { IsString, IsOptional, IsIn } from 'class-validator';

export class AssignGuideDto {
  @IsString({ message: 'Guide ID must be a string' })
  guideId: string;

  @IsString({ message: 'Role must be a string' })
  @IsIn(['lead', 'assistant'], { message: 'Role must be: lead or assistant' })
  @IsOptional()
  role?: string;
}

export class AssignDriverDto {
  @IsString({ message: 'Driver ID must be a string' })
  driverId: string;

  @IsString({ message: 'Vehicle ID must be a string' })
  @IsOptional()
  vehicleId?: string;
}
