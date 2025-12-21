import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsArray,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  IsUrl,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString({ message: 'Tour ID must be a string' })
  @IsNotEmpty({ message: 'Tour ID is required' })
  tourId: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Please enter your name' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Country must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Country name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @IsInt({ message: 'Rating must be a whole number' })
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  @Type(() => Number)
  rating: number;

  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @MaxLength(200, { message: 'Review title cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Please share your experience' })
  @MinLength(20, { message: 'Review must be at least 20 characters' })
  @MaxLength(3000, { message: 'Review cannot exceed 3000 characters' })
  @Transform(({ value }) => value?.trim())
  comment: string;

  @IsArray({ message: 'Images must be an array' })
  @IsOptional()
  @ArrayMaxSize(5, { message: 'You can upload maximum 5 images' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];
}
