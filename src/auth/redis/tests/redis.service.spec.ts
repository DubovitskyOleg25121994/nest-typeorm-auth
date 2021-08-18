import { Roles } from '../../../users/entities/roles.entity';
import { Users } from '../../../users/entities/users.entity';
import { RedisService } from '../redis.service';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [{ id: 1, name: 'admin' }] as Roles[];
user.createdAt = new Date();

const key = 'key';

describe('RedisService', () => {
	let redisService: RedisService;

	beforeEach(() => {
		redisService = new RedisService(null);
	});

	describe('getCacheByKey', () => {
		it('should return data from cache', async () => {
			jest.spyOn(redisService, 'getCacheByKey').mockImplementation(async () => user);
			const result = await redisService.getCacheByKey(key);
			await expect(result).toEqual(user);
		});
	});

	describe('setCacheByKey', () => {
		it('should add data in cache', async () => {
			jest.spyOn(redisService, 'setCacheByKey').mockImplementation(undefined);
			const result = await redisService.setCacheByKey(key, user);
			await expect(result).toBeUndefined();
		});
	});

	describe('removeCacheByKey', () => {
		it('should remove data from cache', async () => {
			jest.spyOn(redisService, 'removeCacheByKey').mockImplementation(undefined);
			const result = await redisService.removeCacheByKey(key);
			await expect(result).toBeUndefined();
		});
	});
});
