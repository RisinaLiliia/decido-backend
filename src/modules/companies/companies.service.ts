// src/modules/companies/companies.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(dto: CreateCompanyDto & { ownerId: string }) {
    return this.companyModel.create({
      ...dto,
      rating: 0,
      votes: 0,
      verified: false,
      isActive: true,
    });
  }

  async findAll(filters?: {
    category?: string;
    city?: string;
    hasOffers?: boolean;
    minRating?: number;
    nearLng?: number;
    nearLat?: number;
    distance?: number;
    onlyOpenNow?: boolean;
  }) {
    const query: Record<string, unknown> = { isActive: true };

    if (filters?.category) query.category = filters.category;
    if (filters?.city) query.city = filters.city;
    if (filters?.minRating) query.rating = { $gte: filters.minRating };

    if (filters?.hasOffers) {
      query['offers.validUntil'] = { $gt: new Date() };
    }

    if (filters?.nearLng && filters?.nearLat && filters?.distance) {
      query.geo = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.nearLng, filters.nearLat],
          },
          $maxDistance: filters.distance * 1000,
        },
      };
    }

    const companies = await this.companyModel.find(query).exec();

    if (filters?.onlyOpenNow) {
      return companies.filter((c) => this.isOpenNow(c));
    }

    return companies;
  }

  async findOne(id: string) {
    const company = await this.companyModel.findById(id).exec();
    if (!company || !company.isActive) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async addOffer(
    companyId: string,
    offer: { title: string; description: string; validUntil: Date },
  ) {
    if (offer.validUntil <= new Date()) {
      throw new BadRequestException('Offer expired');
    }

    return this.companyModel.findByIdAndUpdate(
      companyId,
      { $push: { offers: offer } },
      { new: true },
    );
  }

  async decideNow(params: {
    category?: string;
    city?: string;
    userLat: number;
    userLng: number;
  }) {
    const companies = await this.findAll({
      category: params.category,
      city: params.city,
      nearLat: params.userLat,
      nearLng: params.userLng,
      distance: 10,
      onlyOpenNow: true,
      hasOffers: true,
    });

    const scored = companies.map((c) => ({
      company: c,
      score: this.calculateScore(c, params),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored[0]?.company ?? null;
  }

  private calculateScore(
    company: CompanyDocument,
    params: {
      userLat: number;
      userLng: number;
      category?: string;
      city?: string;
    },
  ) {
    const ratingScore = company.rating ? company.rating * 2 : 0;
    const offersScore = Array.isArray(company.offers)
      ? company.offers.length * 5
      : 0;

    const [lng, lat] = company.geo?.coordinates ?? [0, 0];
    const distance = Math.sqrt(
      Math.pow(lat - params.userLat, 2) + Math.pow(lng - params.userLng, 2),
    );

    const distanceScore = Math.max(0, 10 - distance * 10);

    return ratingScore + offersScore + distanceScore;
  }

  private isOpenNow(company: CompanyDocument): boolean {
    if (!company.workingHours?.length) return true;

    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const time = now.toTimeString().slice(0, 5);

    const today = company.workingHours.find(
      (w) => w.day.toLowerCase() === day.toLowerCase(),
    );

    if (!today) return false;
    return time >= today.open && time <= today.close;
  }
}
