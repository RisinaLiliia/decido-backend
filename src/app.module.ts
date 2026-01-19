import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/env';
import { DatabaseModule } from './config/database';
import { RedisModule } from './config/redis';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = config.get<number>('THROTTLE_TTL') || 60;
        const limit = config.get<number>('THROTTLE_LIMIT') || 100;

        const options: ThrottlerModuleOptions = {
          throttlers: [
            {
              ttl,
              limit,
            },
          ],
        };

        return options;
      },
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
