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

export enum CompanyCategory {
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  CINEMA = 'cinema',
  TOUR = 'tour',
}

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEnum(CompanyCategory)
  category: CompanyCategory;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: WorkingHourDto[];

  @IsOptional()
  @IsNumber()
  averagePrice?: number;
}

export class GeoDto {
  @IsString()
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  coordinates: [number, number];
}

export class WorkingHourDto {
  @IsString() day: string;
  @IsString() open: string;
  @IsString() close: string;
}
