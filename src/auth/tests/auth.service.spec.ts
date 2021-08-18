import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Roles } from '../../users/entities/roles.entity';
import { Users } from '../../users/entities/users.entity';
import { RoleService } from '../../users/roles/roles.service';
import { UsersService } from '../../users/users.service';
import { ActivationService } from '../activation/activation.service';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { TokenDataDto } from '../dto/token-data.dto';
import { UserRoles } from '../enums/role.enums';
import { JwtAuthService } from '../jwt/jwt.service';
import { TokensService } from '../tokens/tokens.service';

const role = new Roles();
role.id = 2;
role.name = 'manager';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [role] as Roles[];
user.createdAt = new Date('2021-08-17T08:32:05.875Z');

const activationToken = 'activationToken';
const refreshToken = 'refreshToken';
const password = '$2a$12$2BnSYeyIpyBuMR0KA69acOrqcEWx0T3BqRAY.UJmyxWV74N9jAQM2'; // 123456

const loginDto = new LoginDto();
loginDto.email = user.email;
loginDto.password = password;

const registrationDto = new RegistrationDto();
registrationDto.email = user.email;
registrationDto.firstName = user.firstName;
registrationDto.lastName = user.lastName;
registrationDto.role = UserRoles.MANAGER;

const setPasswordDto = new SetPasswordDto();
setPasswordDto.token = activationToken;
setPasswordDto.password = '12346';

describe('AuthService', () => {
	let authService: AuthService;
	let jwtAuthService: JwtAuthService;
	let usersService: UsersService;
	let tokensService: TokensService;
	let configService: ConfigService;
	let roleService: RoleService;
	let activationService: ActivationService;

	beforeEach(() => {
		configService = new ConfigService();
		jwtAuthService = new JwtAuthService(null, null);
		usersService = new UsersService(null);
		roleService = new RoleService(null);
		tokensService = new TokensService(null);
		activationService = new ActivationService(null, null, null);
		authService = new AuthService(
			configService,
			jwtAuthService,
			usersService,
			roleService,
			tokensService,
			activationService,
		);
	});

	describe('login', () => {
		it('should return error "User is not found"', async () => {
			jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(undefined);
			expect(authService.login(loginDto)).rejects.toThrow(new HttpException('User is not found', HttpStatus.FORBIDDEN));
		});

		it('should return error "Password is not correct"', async () => {
			jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
			jest.spyOn(authService, 'comparePasswords').mockResolvedValue(false);
			expect(authService.login(loginDto)).rejects.toThrow(
				new HttpException('Password is not correct', HttpStatus.FORBIDDEN),
			);
		});

		it('should return tokens data', async () => {
			const tokenDataDto = new TokenDataDto();
			tokenDataDto.accessToken = activationToken;
			tokenDataDto.refreshToken = refreshToken;
			tokenDataDto.expiresIn = 1629183846;
			jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
			jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
			jest.spyOn(jwtAuthService, 'createAccessToken').mockResolvedValue(activationToken as never);
			jest.spyOn(tokensService, 'generateToken').mockResolvedValue(refreshToken as never);
			jest.spyOn(jwtAuthService, 'getTokeData').mockReturnValue(tokenDataDto);
			const response = await authService.login(loginDto);
			expect(response).toEqual(tokenDataDto);
		});
	});

	describe('registration', () => {
		it('should return error "User is already exist"', async () => {
			jest.spyOn(usersService, 'checkUserByEmail').mockResolvedValue(true);
			expect(authService.registration(registrationDto)).rejects.toThrow(
				new HttpException('User is already exist', HttpStatus.FORBIDDEN),
			);
		});

		it('should return new user', async () => {
			jest.spyOn(usersService, 'checkUserByEmail').mockResolvedValue(false);
			jest.spyOn(roleService, 'getRole').mockResolvedValue(role);
			jest.spyOn(usersService, 'createUser').mockResolvedValue(user);
			jest.spyOn(activationService, 'createEmailActivation').mockResolvedValue(undefined);

			const response = await authService.registration(registrationDto);
			expect(response).toEqual(user);
		});
	});

	describe('set password', () => {
		it('should return error "Invalid or expired token"', async () => {
			jest.spyOn(tokensService, 'getTokenDataByKey').mockResolvedValue(null);
			expect(authService.setPassword(setPasswordDto)).rejects.toThrow(
				new HttpException('Invalid or expired token', HttpStatus.FORBIDDEN),
			);
		});

		it('should set new password', async () => {
			jest.spyOn(tokensService, 'getTokenDataByKey').mockResolvedValue(user);
			jest.spyOn(authService, 'getHashPassword').mockResolvedValue(password);
			user.password = password;
			jest.spyOn(usersService, 'updateUser').mockResolvedValue(user);
			jest.spyOn(tokensService, 'removeToken').mockResolvedValue(undefined);
			const response = await authService.setPassword(setPasswordDto);
			expect(response).toBeUndefined();
		});
	});

	describe('comparePasswords', () => {
		it('should return true', async () => {
			const response = await authService.comparePasswords('123456', password);
			expect(response).toBeTruthy();
		});

		it('should return false', async () => {
			const response = await authService.comparePasswords('123', password);
			expect(response).toBeFalsy();
		});
	});

	describe('getHashPassword', () => {
		it('should return hash password', async () => {
			const response = await authService.getHashPassword('123456', 12);
			expect(typeof response).toBe('string');
		});
	});

	describe('getRefreshTokenExpire', () => {
		it('should return date', async () => {
			const response = await authService.getRefreshTokenExpire();
			const isDate = Object.prototype.toString.call(response) === '[object Date]';
			expect(isDate).toBeTruthy();
		});
	});
});
