import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { hashPassword, comparePassword } from '../../utils/password';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

interface JwtPayload {
  sub: string;
  role: 'user' | 'business' | 'admin';
}

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async register(data: CreateUserDto) {
    const user = await this.usersService.create(data);
    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    let verified: JwtPayload;

    try {
      verified = this.jwt.verify<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException();
    }

    if (!verified?.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(verified.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const ok = await comparePassword(refreshToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserDocument) {
    const userId =
      user._id instanceof Types.ObjectId
        ? user._id.toHexString()
        : String(user._id);

    const payload: { sub: string; role: 'user' | 'business' | 'admin' } = {
      sub: userId,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    const refreshHash = await hashPassword(refreshToken);
    await this.usersService.updateRefreshToken(userId, refreshHash);

    return { accessToken, refreshToken };
  }
}
