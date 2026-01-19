import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  sign(payload: object): string {
    return this.jwt.sign(payload);
  }

  verify<T extends object = object>(token: string): T {
    return this.jwt.verify<T>(token);
  }
}
