import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllPostsDto {
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
  @IsString()
  cityId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['published', 'draft'])
  status?: 'published' | 'draft';

  @IsOptional()
  @IsEnum(['newest', 'oldest', 'popular'])
  sortBy?: 'newest' | 'oldest' | 'popular' = 'newest';
}
