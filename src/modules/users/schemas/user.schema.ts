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
}

export const UserSchema = SchemaFactory.createForClass(User);
