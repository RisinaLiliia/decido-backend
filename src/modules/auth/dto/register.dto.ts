// src/modules/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsIn,
  IsBoolean,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Liliia', description: 'User full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'liliia@example.com', description: 'User email' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain uppercase letter and number',
  })
  password: string;

  @ApiProperty({ example: 'New York', description: 'User city' })
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  @IsOptional()
  @IsIn(['user', 'business'])
  role?: 'user' | 'business';

  @ApiProperty({ example: true, description: 'Accept privacy policy' })
  @IsBoolean()
  acceptPrivacyPolicy: boolean;
}
