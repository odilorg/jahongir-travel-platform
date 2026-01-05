import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsNumber,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateInquiryDto {
  @IsString({ message: 'Tour ID must be a string' })
  @IsOptional()
  tourId?: string;

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

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\d\s\-+()]*$/, {
    message: 'Phone number can only contain digits, spaces, and +-()',
  })
  phone?: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Please describe your travel plans' })
  @MinLength(10, { message: 'Message must be at least 10 characters' })
  @MaxLength(3000, { message: 'Message cannot exceed 3000 characters' })
  @Transform(({ value }) => value?.trim())
  message: string;

  @IsDateString({}, { message: 'Please enter a valid date (YYYY-MM-DD)' })
  @IsOptional()
  travelDate?: string;

  @IsDateString({}, { message: "Please enter a valid start date (YYYY-MM-DD)" })
  @IsOptional()
  travelDateFrom?: string;

  @IsDateString({}, { message: "Please enter a valid end date (YYYY-MM-DD)" })
  @IsOptional()
  travelDateTo?: string;

  @IsInt({ message: 'Number of people must be a whole number' })
  @Min(1, { message: 'At least 1 person is required' })
  @Max(100, { message: 'Maximum group size is 100 people' })
  @Type(() => Number)
  @IsOptional()
  numberOfPeople?: number;

  @IsNumber({}, { message: 'Budget must be a number' })
  @Min(0, { message: 'Budget cannot be negative' })
  @Max(1000000, { message: 'Budget seems too high, please contact us directly' })
  @IsOptional()
  @Type(() => Number)
  budget?: number;
}
