import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Users } from '../../entities/users.entity';
import { Roles } from '../../entities/roles.entity';
import { TokensService } from '../../../auth/tokens/tokens.service';
import { InformationService } from '../../information/information.service';
import { UsersService } from '../../users.service';
import { RestoreService } from '../restore.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';

const password = '$2a$12$2BnSYeyIpyBuMR0KA69acOrqcEWx0T3BqRAY.UJmyxWV74N9jAQM2'; // 123456

const role = new Roles();
role.id = 2;
role.name = 'manager';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.password = password;
user.roles = [role] as Roles[];
user.createdAt = new Date('2021-08-17T08:32:05.875Z');

const UI_URL = 'http://localhost:3000';
const resetToken = 'resetToken';
const link = `${UI_URL}/reset-password?token=${resetToken}`;

const resetPasswordDto = new ResetPasswordDto();
resetPasswordDto.token = resetToken;
resetPasswordDto.password = '123456';

describe('RestoreService', () => {
	let usersService: UsersService;
	let informationService: InformationService;
	let tokensService: TokensService;
	let configService: ConfigService;
	let restoreService: RestoreService;

	beforeEach(() => {
		usersService = new UsersService(null);
		informationService = new InformationService(null);
		tokensService = new TokensService(null);
		configService = new ConfigService({
			UI_URL,
			SALT_ROUNDS: '12',
		});
		restoreService = new RestoreService(usersService, informationService, tokensService, configService);
	});

	describe('sendEmailForResetPassword', () => {
		it('should return error "User is not found"', async () => {
			jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
			expect(restoreService.sendEmailForResetPassword(user.email)).rejects.toThrow(
				new HttpException('User is not found', HttpStatus.NOT_FOUND),
			);
		});

		it('should set new password', async () => {
			jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
			jest.spyOn(tokensService, 'generateToken').mockReturnValue(resetToken);
			jest.spyOn(tokensService, 'addTokenInRedis').mockResolvedValue(undefined);
			jest.spyOn(restoreService, 'getneratResetPasswordLink').mockReturnValue(link);
			jest.spyOn(informationService, 'sendEmailResetPassword').mockResolvedValue(undefined);
			const response = await restoreService.sendEmailForResetPassword(user.email);
			expect(response).toBeUndefined();
		});
	});

	describe('resetPassword', () => {
		it('should return error "Invalid or expired token"', async () => {
			jest.spyOn(tokensService, 'getTokenDataByKey').mockResolvedValue(null);
			expect(restoreService.resetPassword(resetPasswordDto)).rejects.toThrow(
				new HttpException('Invalid or expired token', HttpStatus.FORBIDDEN),
			);
		});

		it('should reset password', async () => {
			jest.spyOn(tokensService, 'getTokenDataByKey').mockResolvedValue(user);
			jest.spyOn(restoreService, 'getHashPassword').mockResolvedValue(password);
			jest.spyOn(usersService, 'updateUser').mockResolvedValue(undefined);
			jest.spyOn(tokensService, 'removeToken').mockResolvedValue(undefined);
			const response = await restoreService.resetPassword(resetPasswordDto);
			expect(response).toBeUndefined();
		});
	});

	describe('getneratResetPasswordLink', () => {
		it('should return link', async () => {
			const response = await restoreService.getneratResetPasswordLink(resetToken);
			expect(response).toEqual(link);
		});
	});

	describe('getHashPassword', () => {
		it('should return hash password', async () => {
			const response = await restoreService.getHashPassword('123456', 12);
			expect(typeof response).toBe('string');
		});
	});
});
