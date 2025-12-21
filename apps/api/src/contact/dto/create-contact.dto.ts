import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
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

  @IsString({ message: 'Subject must be a string' })
  @IsOptional()
  @MaxLength(200, { message: 'Subject cannot exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  subject?: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Please enter your message' })
  @MinLength(10, { message: 'Message must be at least 10 characters' })
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters' })
  @Transform(({ value }) => value?.trim())
  message: string;
}
