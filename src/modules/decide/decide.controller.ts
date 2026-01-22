// src/modules/decide/decide.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { DecideService } from './decide.service';

@Controller('decide')
export class DecideController {
  constructor(private readonly decideService: DecideService) {}

  @Post('now')
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
