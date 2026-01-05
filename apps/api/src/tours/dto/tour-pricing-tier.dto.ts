import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PricingTierTranslationDto {
  @IsString()
  @IsNotEmpty()
  locale: 'en' | 'ru' | 'uz';

  @IsString()
  @IsNotEmpty()
  label: string;
}

export class CreateTourPricingTierDto {
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsInt()
  @Min(1)
  minGuests: number;

  @IsInt()
  @Min(1)
  maxGuests: number;

  @IsNumber()
  @Min(0)
  pricePerPerson: number;

  @IsInt()
  @IsOptional()
  order?: number = 0;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingTierTranslationDto)
  @IsOptional()
  translations?: PricingTierTranslationDto[];
}

export class UpdateTourPricingTierDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  minGuests?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxGuests?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerPerson?: number;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingTierTranslationDto)
  @IsOptional()
  translations?: PricingTierTranslationDto[];
}

export class TourPricingTierResponseDto {
  id: string;
  tourId: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  order: number;
  isActive: boolean;
  label: string; // Flattened from translation
  createdAt: Date;
  updatedAt: Date;
}
