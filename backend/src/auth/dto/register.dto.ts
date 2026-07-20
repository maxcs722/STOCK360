import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  companyId!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}