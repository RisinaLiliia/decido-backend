import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop()
  date: Date;

  @Prop({ default: false })
  confirmed: boolean;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
