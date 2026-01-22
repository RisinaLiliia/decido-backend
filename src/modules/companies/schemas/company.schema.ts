// src/modules/companies/schemas/company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['cafe', 'restaurant', 'bar', 'cinema', 'tour'],
  })
  category: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  geo: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({
    type: [{ day: String, open: String, close: String }],
    default: [],
  })
  workingHours: {
    day: string;
    open: string;
    close: string;
  }[];

  @Prop({ default: 0 })
  averagePrice: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  votes: number;

  @Prop({
    type: [
      {
        title: String,
        description: String,
        validUntil: Date,
      },
    ],
    default: [],
  })
  offers: {
    title: string;
    description: string;
    validUntil: Date;
  }[];

  @Prop({ default: false })
  verified: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.index({ geo: '2dsphere' });
