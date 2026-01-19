import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async create(data: Partial<Visit>): Promise<Visit> {
    const visit = new this.visitModel(data);
    return visit.save();
  }

  async findByUser(userId: string): Promise<Visit[]> {
    return this.visitModel.find({ userId }).exec();
  }
}
