import { TokensService } from '../tokens.service';
import { RedisService } from '../../redis/redis.service';
import { Users } from '../../../users/entities/users.entity';
import { Roles } from '../../../users/entities/roles.entity';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [{ id: 1, name: 'admin' }] as Roles[];
user.createdAt = new Date();

const key = 'key';

describe('TokensService', () => {
	let tokensService: TokensService;
	let redisService: RedisService;

	beforeEach(() => {
		redisService = new RedisService(null);
		tokensService = new TokensService(redisService);
	});

	describe('getTokenDataByKey', () => {
		it('should return token data', async () => {
			jest.spyOn(redisService, 'getCacheByKey').mockResolvedValue(user);
			const result = await tokensService.getTokenDataByKey(key);
			await expect(result).toEqual(user);
		});
	});

	describe('removeToken', () => {
		it('should return token data', async () => {
			jest.spyOn(redisService, 'removeCacheByKey').mockResolvedValue(undefined);
			const result = await tokensService.removeToken(undefined);
			await expect(result).toBeUndefined();
		});
	});

	describe('addTokenInRedis', () => {
		it('should add token data in cache', async () => {
			jest.spyOn(redisService, 'setCacheByKey').mockResolvedValue(undefined);
			const result = await tokensService.addTokenInRedis(key, user);
			await expect(result).toBeUndefined();
		});
	});

	describe('generateToken', () => {
		it('should generate token', async () => {
			const result = await tokensService.generateToken();
			await expect(typeof result).toBe('string');
		});
	});
});
