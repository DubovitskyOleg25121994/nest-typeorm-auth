import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class RedisService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	getCacheByKey(key: string) {
		return this.cacheManager.get<any>(key);
	}

	async setCacheByKey(key: string, value: any) {
		await this.cacheManager.set(key, value);
	}

	async removeCacheByKey(key: string) {
		await this.cacheManager.del(key);
	}
}
