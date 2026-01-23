// src/modules/companies/dto/create-company.dto.ts
import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum CompanyCategory {
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  CINEMA = 'cinema',
  TOUR = 'tour',
}

export class GeoDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  coordinates: [number, number];
}

export class WorkingHourDto {
  @ApiProperty({ example: 'Monday' })
  @IsString()
  day: string;
  @IsString() open: string;
  @IsString() close: string;
}

export class CreateCompanyDto {
  @ApiProperty({ example: 'Awesome Cafe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'cafe' })
  @IsEnum(CompanyCategory)
  category: CompanyCategory;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: { type: 'Point', coordinates: [-74.006, 40.7128] } })
  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto;

  @ApiProperty({ example: [{ day: 'Monday', open: '09:00', close: '18:00' }] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: WorkingHourDto[];

  @ApiProperty({ example: 25.5, required: false })
  @IsOptional()
  @IsNumber()
  averagePrice?: number;
}
