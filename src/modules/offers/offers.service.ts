import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(data: Partial<Offer>): Promise<Offer> {
    const offer = new this.offerModel(data);
    return offer.save();
  }

  async findByCompany(companyId: string): Promise<Offer[]> {
    return this.offerModel.find({ companyId }).exec();
  }
}
