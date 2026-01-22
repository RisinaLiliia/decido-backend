// src/modules/decide/decide.service.ts
import { Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { CompanyDocument } from '../companies/schemas/company.schema';

@Injectable()
export class DecideService {
  constructor(private readonly companiesService: CompaniesService) {}

  async decideNow(filters: {
    budget?: number;
    category?: string;
    city?: string;
  }): Promise<CompanyDocument | null> {
    const companies = await this.companiesService.findAll({
      category: filters.category,
      city: filters.city,
      onlyOpenNow: true,
    });

    if (!companies.length) return null;

    const scored = companies.map((c) => ({
      company: c,
      score:
        (filters.category && c.category === filters.category ? 2 : 0) +
        (filters.budget && c.averagePrice
          ? c.averagePrice <= filters.budget
            ? 2
            : 0
          : 0),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored[0].company ?? null;
  }

  async plan(filters: {
    date: Date;
    budget?: number;
    category?: string;
    city?: string;
  }) {
    const company = await this.decideNow(filters);

    return {
      date: filters.date,
      scenario: company ? [company] : [],
    };
  }
}
