import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  validUntil: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
