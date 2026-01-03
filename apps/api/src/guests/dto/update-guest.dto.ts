import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateGuestDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\d\s\-+()]*$/, {
    message: 'Phone number can only contain digits, spaces, and +-()',
  })
  phone?: string;

  @IsString({ message: 'Country must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Country cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @IsString({ message: 'Preferred language must be a string' })
  @IsOptional()
  @IsIn(['ru', 'en', 'uz'], { message: 'Preferred language must be ru, en, or uz' })
  preferredLanguage?: string;

  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(2000, { message: 'Notes cannot exceed 2000 characters' })
  @Transform(({ value }) => value?.trim())
  notes?: string;
}
