import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum DepartureStatus {
  AVAILABLE = 'available',
  FILLING_FAST = 'filling_fast',
  ALMOST_FULL = 'almost_full',
  SOLD_OUT = 'sold_out',
  CANCELLED = 'cancelled',
}

export class CreateTourDepartureDto {
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  @Min(1)
  maxSpots: number;

  @IsInt()
  @Min(0)
  spotsRemaining: number;

  @IsEnum(DepartureStatus)
  @IsOptional()
  status?: DepartureStatus = DepartureStatus.AVAILABLE;

  @IsNumber()
  @IsOptional()
  @Min(0.5)
  @Max(3)
  priceModifier?: number;

  @IsBoolean()
  @IsOptional()
  isGuaranteed?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateTourDepartureDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxSpots?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  spotsRemaining?: number;

  @IsEnum(DepartureStatus)
  @IsOptional()
  status?: DepartureStatus;

  @IsNumber()
  @IsOptional()
  @Min(0.5)
  @Max(3)
  priceModifier?: number;

  @IsBoolean()
  @IsOptional()
  isGuaranteed?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class TourDepartureResponseDto {
  id: string;
  tourId: string;
  startDate: Date;
  endDate: Date;
  maxSpots: number;
  spotsRemaining: number;
  status: DepartureStatus;
  priceModifier: number | null;
  isGuaranteed: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
