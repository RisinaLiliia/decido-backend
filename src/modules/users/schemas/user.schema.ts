// src/modules/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  city?: string;

  @Prop()
  language?: string;

  @Prop({ default: 0 })
  deciCoins: number;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  favoritePlaces: string[];

  @Prop({ type: [String], default: [] })
  friends: string[];

  @Prop({
    type: {
      foodType: [String],
      noiseLevel: { type: String, enum: ['low', 'medium', 'high'] },
      budget: { type: String, enum: ['low', 'medium', 'high'] },
      favoriteCompanies: [String],
    },
    default: {},
  })
  preferences: {
    foodType?: string[];
    noiseLevel?: 'low' | 'medium' | 'high';
    budget?: 'low' | 'medium' | 'high';
    favoriteCompanies?: string[];
  };

  @Prop({ type: [Date], default: [] })
  birthdays: Date[];

  @Prop({
    type: [
      {
        visitId: String,
        companyId: String,
        rating: Number,
        date: Date,
      },
    ],
    default: [],
  })
  history: {
    visitId: string;
    companyId: string;
    rating: number;
    date: Date;
  }[];

  @Prop({ default: 'user' })
  role: 'user' | 'business' | 'admin';

  @Prop()
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
