import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokensService {
	constructor(private readonly redisService: RedisService) {}

	getTokenDataByKey(key: string) {
		return this.redisService.getCacheByKey(key);
	}

	async removeToken(token: string): Promise<void> {
		await this.redisService.removeCacheByKey(token);
	}

	async addTokenInRedis(key: string, params: any) {
		await this.redisService.setCacheByKey(key, params);
	}

	generateToken(): string {
		return crypto.randomBytes(32).toString('hex');
	}
}
