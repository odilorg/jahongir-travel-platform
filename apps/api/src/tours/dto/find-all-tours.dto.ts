import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllToursDto {
  @IsOptional()
  @IsString()
  @IsIn(['en', 'ru', 'uz'])
  lang?: 'en' | 'ru' | 'uz';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  minDuration?: number;

  @IsOptional()
  @IsInt()
  @Max(365)
  @Type(() => Number)
  maxDuration?: number;

  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['featured', 'price-asc', 'price-desc', 'duration-asc', 'duration-desc', 'newest'])
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc' | 'newest' = 'newest';

  @IsOptional()
  @IsString()
  featured?: string; // 'true' or 'false'

  @IsOptional()
  @IsString()
  isActive?: string; // 'true' or 'false'
}
