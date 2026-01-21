// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../utils/password';
import { calculateLevel } from '../../utils/level';

type UpdateUserDto = Partial<{
  city: string;
  dateOfBirth: string;
  deciCoins: number;
  avatar: { url: string; isDefault: boolean };
  preferences: User['preferences'];
  favoritePlaces: string[];
  friends: string[];
}>;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(
    dto: CreateUserDto &
      Partial<{
        role: 'user' | 'business' | 'admin';
        acceptedPrivacyPolicy?: boolean;
        acceptedPrivacyPolicyAt?: Date | null;
        city?: string;
        dateOfBirth?: string;
      }>,
  ): Promise<UserDocument> {
    const hash = await hashPassword(dto.password);

    const role = dto.role ?? 'user';
    const acceptedPrivacyPolicy = dto.acceptedPrivacyPolicy ?? false;
    const acceptedPrivacyPolicyAt =
      dto.acceptedPrivacyPolicyAt === undefined
        ? null
        : dto.acceptedPrivacyPolicyAt;

    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash: hash,
      role,
      acceptedPrivacyPolicy,
      acceptedPrivacyPolicyAt,
      city: dto.city,
      dateOfBirth: dto.dateOfBirth,
      level: 'Novice',
      avatar: {
        url: '/avatars/default.png',
        isDefault: true,
      },
    });

    return user.save();
  }

  async updateRefreshToken(userId: string, hash: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { refreshTokenHash: hash })
      .exec();
  }

  async setRole(
    userId: string,
    role: 'user' | 'business' | 'admin',
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { role }).exec();
  }

  async updateProfile(
    userId: string,
    updates: Partial<{
      city?: string;
      dateOfBirth?: string;
      acceptedPrivacyPolicy?: boolean;
      acceptedPrivacyPolicyAt?: Date;
    }>,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, updates).exec();
  }

  async updateUser(userId: string, updates: UpdateUserDto): Promise<void> {
    const updatedData: UpdateUserDto & { level?: User['level'] } = {
      ...updates,
    };

    if (updates.deciCoins !== undefined) {
      updatedData.level = calculateLevel(updates.deciCoins);
    }

    const result = await this.userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
