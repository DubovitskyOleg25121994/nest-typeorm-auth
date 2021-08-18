import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { TokensService } from './tokens.service';

@Module({
	imports: [RedisModule],
	controllers: [],
	providers: [TokensService],
	exports: [TokensService],
})
export class TokensModule {}
