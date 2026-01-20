import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
