// src/modules/decide/decide.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { DecideService } from './decide.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Decide')
@Controller('decide')
export class DecideController {
  constructor(private readonly decideService: DecideService) {}

  @Post('now')
  @ApiOperation({ summary: 'Get best option right now' })
  @ApiResponse({ status: 200, description: 'Recommended company or null' })
  decideNow(
    @Body()
    filters: {
      budget?: number;
      category?: string;
      city?: string;
    },
  ) {
    return this.decideService.decideNow(filters);
  }

  @Post('plan')
  @ApiOperation({ summary: 'Plan visit for a specific date' })
  @ApiResponse({ status: 201, description: 'Plan created' })
  plan(
    @Body()
    filters: {
      date: Date;
      budget?: number;
      category?: string;
      city?: string;
    },
  ) {
    return this.decideService.plan(filters);
  }
}
