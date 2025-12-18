import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortDescription?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  duration: number;

  @IsInt()
  @IsOptional()
  maxGroupSize?: number;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  included?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excluded?: string[];

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsBoolean()
  @IsOptional()
  showPrice?: boolean = true;

  @IsNumber()
  @IsOptional()
  discountedPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;
}
