import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenDataDto } from '../../dto/token-data.dto';
import { IJwtPayload } from '../interfaces/jwt.interface';
import { JwtAuthService } from '../jwt.service';

const accessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAbWFpbC5ydSIsInJvbGVzIjpbIm1hbmFnZXIiXSwiaWF0IjoxNjI5MjA3NjU0LCJleHAiOjE5NDQ3ODM2NTR9.tN-CNopuQbnHwaPMJ0iecrZPpYXvUX9RgvT_vKCzKe0';
const refreshToken = 'refreshToken';
const payload = {} as IJwtPayload;
payload.email = 'test@mail.ru';
payload.roles = ['manager'];

const tokenDataDto = new TokenDataDto();
tokenDataDto.accessToken = accessToken;
tokenDataDto.refreshToken = refreshToken;
tokenDataDto.expiresIn = 1944783654;

describe('JwtAuthService', () => {
	let jwtAuthService: JwtAuthService;
	let jwtService: JwtService;
	let configService: ConfigService;

	beforeEach(() => {
		jwtService = new JwtService({
			secret: 'secret',
		});
		configService = new ConfigService({
			JWT_EXPIRES_IN: '10y',
		});
		jwtAuthService = new JwtAuthService(jwtService, configService);
	});

	describe('getTokeData', () => {
		it('should return token data', async () => {
			const response = await jwtAuthService.getTokeData(accessToken, refreshToken);
			expect(response).toEqual(tokenDataDto);
		});
	});

	describe('createAccessToken', () => {
		it('should return access token', async () => {
			const response = await jwtAuthService.createAccessToken(payload);
			expect(typeof response).toBe('string');
		});
	});

	describe('verifyToken', () => {
		it('should return token data', async () => {
			const verifyTokenData = {
				email: 'test@mail.ru',
				roles: ['manager'],
				iat: 1629207654,
				exp: 1944783654,
			};
			const response = await jwtAuthService.verifyToken(accessToken);
			expect(response).toEqual(verifyTokenData);
		});
	});
});
