import {
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
  IsBoolean,
  MinLength,
  MaxLength,
  ArrayMaxSize,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateGuideDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  name?: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @Matches(/^[\d\s\-+()]*$/, { message: 'Phone must contain only valid phone characters' })
  @MaxLength(20, { message: 'Phone cannot exceed 20 characters' })
  phone?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsArray({ message: 'Languages must be an array' })
  @IsString({ each: true, message: 'Each language must be a string' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 languages' })
  @IsOptional()
  languages?: string[];

  @IsString({ message: 'Notes must be a string' })
  @MaxLength(2000, { message: 'Notes cannot exceed 2000 characters' })
  @IsOptional()
  notes?: string;

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @IsString({ message: 'Company ID must be a string' })
  @IsOptional()
  companyId?: string;
}
