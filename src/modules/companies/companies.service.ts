import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(): Promise<CompanyDocument[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string): Promise<CompanyDocument> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: Partial<Company>): Promise<CompanyDocument> {
    const company = new this.companyModel(data);
    return company.save();
  }

  async addOffer(
    companyId: string,
    offer: { title: string; description: string; validUntil: Date },
  ): Promise<CompanyDocument> {
    const company = await this.findOne(companyId);
    company.offers.push(offer);
    return company.save();
  }
}
