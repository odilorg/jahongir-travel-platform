import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, Min, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInquiryDto {
  @IsString()
  @IsOptional()
  tourId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsOptional()
  travelDate?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  numberOfPeople?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budget?: number;
}
