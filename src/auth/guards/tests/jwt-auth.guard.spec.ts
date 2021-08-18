import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IJwtPayload } from '../../jwt/interfaces/jwt.interface';
import { JwtAuthGuard } from '../jwt-auth.guard';

const user = {} as IJwtPayload;
user.email = 'test@mail.ru';
user.roles = ['manager'];
const info = new Error('Test Error');
info.name = 'TokenExpiredError';

describe('JwtAuthGuard', () => {
	let jwtAuthGuard: JwtAuthGuard;
	let configService: ConfigService;

	beforeEach(() => {
		configService = new ConfigService({ REMOVE_GUARD: 'false' });
		jwtAuthGuard = new JwtAuthGuard(configService);
	});

	describe('handle Request', () => {
		it(`should return user`, () => {
			configService = new ConfigService({ REMOVE_GUARD: 'true' });
			jwtAuthGuard = new JwtAuthGuard(configService);

			const response = jwtAuthGuard.handleRequest(null, user, null);
			expect(response).toEqual(user);
		});

		it(`should return Unauthorized Exception if Jwt expired`, () => {
			jest.spyOn(jwtAuthGuard, 'handleRequest').mockReturnValue(new UnauthorizedException('Jwt expired'));

			expect(jwtAuthGuard.handleRequest(null, null, info)).toBeInstanceOf(UnauthorizedException);
		});

		it(`should return Unauthorized Exception`, () => {
			jest.spyOn(jwtAuthGuard, 'handleRequest').mockReturnValue(new UnauthorizedException());

			expect(jwtAuthGuard.handleRequest(null, null, null)).toBeInstanceOf(UnauthorizedException);
		});

		it(`should return Error`, () => {
			jest.spyOn(jwtAuthGuard, 'handleRequest').mockReturnValue(new Error());

			expect(jwtAuthGuard.handleRequest(new Error('Тест'), null, null)).toBeInstanceOf(Error);
		});

		it(`should return user`, () => {
			expect(jwtAuthGuard.handleRequest(null, user, null)).toEqual(user);
		});
	});
});
