import { Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class DecideService {
  constructor(private companiesService: CompaniesService) {}

  async decideNow(filters: {
    budget?: string;
    category?: string;
    city?: string;
  }) {
    const companies = await this.companiesService.findAll();
    const filtered = companies.filter(
      (c) =>
        (!filters.category || c.category === filters.category) &&
        (!filters.city || c.city === filters.city),
    );
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  async plan(filters: {
    date: Date;
    budget?: string;
    category?: string;
    city?: string;
  }) {
    const company = await this.decideNow(filters);
    return {
      date: filters.date,
      scenario: [company],
    };
  }
}
