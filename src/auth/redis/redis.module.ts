import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { RedisService } from './redis.service';

@Module({
	imports: [
		CacheModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				ttl: 60 * 60 * 1,
				store: redisStore,
				host: configService.get<string>('REDIS_HOST'),
				port: configService.get<string>('REDIS_PORT'),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
