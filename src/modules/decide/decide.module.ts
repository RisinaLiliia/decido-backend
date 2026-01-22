// src/modules/decide/decide.module.ts

import { Module } from '@nestjs/common';
import { DecideService } from './decide.service';
import { DecideController } from './decide.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  providers: [DecideService],
  controllers: [DecideController],
})
export class DecideModule {}
