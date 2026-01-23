import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './schemas/offer.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new offer' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  create(@Body() data: Partial<Offer>) {
    return this.offersService.create(data);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get offers by company' })
  @ApiResponse({ status: 200, description: 'List of offers' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.offersService.findByCompany(companyId);
  }
}
