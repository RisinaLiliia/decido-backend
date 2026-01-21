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
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain uppercase letter and number',
  })
  password: string;

  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsIn(['user', 'business'])
  role?: 'user' | 'business';

  @IsBoolean()
  acceptPrivacyPolicy: boolean;
}
