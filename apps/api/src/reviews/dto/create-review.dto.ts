import { IsString, IsNotEmpty, IsEmail, IsInt, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
