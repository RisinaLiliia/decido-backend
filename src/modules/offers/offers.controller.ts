import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './schemas/offer.schema';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() data: Partial<Offer>) {
    return this.offersService.create(data);
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.offersService.findByCompany(companyId);
  }
}
