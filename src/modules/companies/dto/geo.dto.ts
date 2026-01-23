import { IsArray, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeoDto {
  @ApiProperty({ example: 'Point' })
  @IsIn(['Point'])
  type: 'Point';

  @ApiProperty({
    example: [40.7128, -74.006],
    type: 'array',
    items: { type: 'number' },
  })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}
