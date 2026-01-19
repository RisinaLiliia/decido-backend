import { Controller, Post, Body } from '@nestjs/common';
import { DecideService } from './decide.service';

@Controller('decide')
export class DecideController {
  constructor(private readonly decideService: DecideService) {}

  @Post('now')
  decideNow(
    @Body() filters: { budget?: string; category?: string; city?: string },
  ) {
    return this.decideService.decideNow(filters);
  }

  @Post('plan')
  plan(
    @Body()
    filters: {
      date: Date;
      budget?: string;
      category?: string;
      city?: string;
    },
  ) {
    return this.decideService.plan(filters);
  }
}
