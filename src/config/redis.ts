import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../services/redis.service';

type SimpleRedisClient = {
  setEx?(key: string, seconds: number, value: string): Promise<unknown>;
  set?(key: string, value: string): Promise<unknown>;
  get?(key: string): Promise<string | null | Buffer>;
  del?(key: string): Promise<unknown>;
  on(event: 'error', listener: (err: unknown) => void): void;
  connect(): Promise<void>;
};

type RedisClient = SimpleRedisClient;

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<RedisClient> => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const client = createClient({
          socket: {
            host: String(config.get('APP_REDIS_HOST') ?? '127.0.0.1'),
            port: Number(config.get('APP_REDIS_PORT') ?? 6379),
          },
          password: config.get<string>('APP_REDIS_PASSWORD') ?? undefined,
        }) as unknown as RedisClient;

        client.on('error', (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          console.error('[Redis] Error:', message);
        });

        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
