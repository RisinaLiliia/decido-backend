// src/modules/companies/companies.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Search companies with filters' })
  @ApiResponse({ status: 200, description: 'List of companies' })
  findAll(
    @Query()
    query: {
      category?: string;
      city?: string;
      hasOffers?: boolean;
      minRating?: number;
      nearLng?: number;
      nearLat?: number;
      distance?: number;
    },
  ) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company details' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Roles('business')
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create company (business role)' })
  @ApiResponse({ status: 201, description: 'Company created' })
  create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.companiesService.create({ ...dto, ownerId: user.userId });
  }

  @Roles('business')
  @Post(':id/offers')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add offer to company' })
  @ApiResponse({ status: 201, description: 'Offer added' })
  addOffer(
    @Param('id') id: string,
    @Body()
    offer: { title: string; description: string; validUntil: Date },
  ) {
    return this.companiesService.addOffer(id, offer);
  }
}
