import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { hashPassword, comparePassword } from '../../utils/password';
import { RegisterDto } from './dto/register.dto';
import { UserDocument, User } from '../users/schemas/user.schema';
import { RedisService } from '../../services/redis.service'; // сервис для Redis

interface JwtPayload {
  sub: string;
  role: 'user' | 'business' | 'admin';
}

type SafeUser = {
  id: string;
  name: string;
  email: string;
  city?: string;
  dateOfBirth?: Date;
  role: User['role'];
  deciCoins: number;
  preferences: User['preferences'];
  favoritePlaces: string[];
  friends: string[];
  acceptedPrivacyPolicy: boolean;
  acceptedPrivacyPolicyAt?: Date | null;
  level?: User['level'];
  avatar?: User['avatar'];
};

export type TokenResponse = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
export type RefreshResponse = Pick<
  TokenResponse,
  'accessToken' | 'refreshToken' | 'expiresIn'
>;

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  async register(data: RegisterDto): Promise<TokenResponse> {
    if (!data.acceptPrivacyPolicy) {
      throw new BadRequestException('User must accept privacy policy');
    }

    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? 'user',
      acceptedPrivacyPolicy: true,
      acceptedPrivacyPolicyAt: new Date(),
      ...(data.city ? { city: data.city } : {}),
      ...(data.dateOfBirth ? { dateOfBirth: data.dateOfBirth } : {}),
    });

    return this.generateTokens(user);
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(
    refreshToken: string,
  ): Promise<
    Pick<TokenResponse, 'accessToken' | 'refreshToken' | 'expiresIn'>
  > {
    if (!refreshToken) throw new UnauthorizedException();

    let payload: JwtPayload;
    try {
      payload = this.jwt.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const userId = String(user._id ?? '');

    const redisHash = await this.redisService.get(`refresh:${userId}`);
    if (!redisHash) throw new UnauthorizedException('Session expired');

    const ok = await comparePassword(refreshToken, redisHash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserDocument) {
    const userId = user._id.toString();
    const payload = { sub: userId, role: user.role };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

    const refreshHash = await hashPassword(refreshToken);

    await this.redisService.del(`refresh:${userId}`);
    await this.redisService.set(
      `refresh:${userId}`,
      refreshHash,
      7 * 24 * 60 * 60,
    );
    await this.usersService.updateRefreshToken(userId, refreshHash);

    const safeUser = {
      id: userId,
      name: user.name,
      email: user.email,
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      deciCoins: user.deciCoins,
      level: user.level,
      avatar: user.avatar,
      preferences: user.preferences,
      favoritePlaces: user.favoritePlaces ?? [],
      friends: user.friends ?? [],
      acceptedPrivacyPolicy: Boolean(user.acceptedPrivacyPolicy),
      acceptedPrivacyPolicyAt: user.acceptedPrivacyPolicyAt ?? null,
    };

    return { user: safeUser, accessToken, refreshToken, expiresIn: 900 };
  }
}
