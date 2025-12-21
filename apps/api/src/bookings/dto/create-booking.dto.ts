import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString({ message: 'Tour ID must be a string' })
  @IsNotEmpty({ message: 'Tour ID is required' })
  tourId: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Please enter your full name' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  customerName: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  customerEmail: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\d\s\-+()]*$/, {
    message: 'Phone number can only contain digits, spaces, and +-()',
  })
  customerPhone?: string;

  @IsDateString({}, { message: 'Please enter a valid travel date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Travel date is required' })
  travelDate: string;

  @IsInt({ message: 'Number of people must be a whole number' })
  @Min(1, { message: 'At least 1 person is required' })
  @Max(50, { message: 'Maximum group size is 50 people' })
  @Type(() => Number)
  numberOfPeople: number;

  @IsString({ message: 'Special requests must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Special requests cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  specialRequests?: string;
}
