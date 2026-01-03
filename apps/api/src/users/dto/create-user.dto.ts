import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: 'admin' | 'user';

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
