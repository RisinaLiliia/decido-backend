import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Visit } from './schemas/visit.schema';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Body() data: Partial<Visit>) {
    return this.visitsService.create(data);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.visitsService.findByUser(userId);
  }
}
