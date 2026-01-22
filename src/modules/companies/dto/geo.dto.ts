import { IsArray, IsIn, IsNumber } from 'class-validator';

export class GeoDto {
  @IsIn(['Point'])
  type: 'Point';

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}
