import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Visit } from './schemas/visit.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new visit' })
  @ApiResponse({ status: 201, description: 'Visit created' })
  create(@Body() data: Partial<Visit>) {
    return this.visitsService.create(data);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get visits by user' })
  @ApiResponse({ status: 200, description: 'List of visits' })
  findByUser(@Param('userId') userId: string) {
    return this.visitsService.findByUser(userId);
  }
}
