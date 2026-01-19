import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Company } from './schemas/company.schema';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Company>) {
    return this.companiesService.create(data);
  }

  @Post(':id/offers')
  addOffer(
    @Param('id') id: string,
    @Body() offer: { title: string; description: string; validUntil: Date },
  ) {
    return this.companiesService.addOffer(id, offer);
  }
}
