import { Users } from '../../users/entities/users.entity';
import { Roles } from '../../users/entities/roles.entity';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { SetPasswordDto } from '../dto/set-password.dto';
import { UserRoles } from '../enums/role.enums';
import { TokenDataDto } from '../dto/token-data.dto';

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

const tokenDataDto = new TokenDataDto();
tokenDataDto.accessToken = activationToken;
tokenDataDto.refreshToken = refreshToken;
tokenDataDto.expiresIn = 1629183846;

describe('AuthController', () => {
	let authService: AuthService;
	let authController: AuthController;

	beforeEach(() => {
		authService = new AuthService(null, null, null, null, null, null);
		authController = new AuthController(authService);
	});

	describe('login', () => {
		it('should return token data', async () => {
			jest.spyOn(authService, 'login').mockResolvedValue(tokenDataDto);
			jest.spyOn(authService, 'getRefreshTokenExpire').mockReturnValue(new Date('2050-01-01'));
			const res = {
				query: {},
				headers: {},
				data: null,
				send(payload) {
					return payload;
				},
				cookie(name, value) {
					this.headers[name] = value;
				},
			};
			const response = await authController.login(res, loginDto);
			expect(response).toEqual(tokenDataDto);
		});
	});

	describe('registration', () => {
		it('should return new user', async () => {
			jest.spyOn(authService, 'registration').mockResolvedValue(user);
			const response = await authController.registration(registrationDto);
			expect(response).toEqual(user);
		});
	});

	describe('set-password', () => {
		it('should set new user password', async () => {
			jest.spyOn(authService, 'setPassword').mockResolvedValue(undefined);
			const response = await authController.setPassword(setPasswordDto);
			expect(response).toBeUndefined();
		});
	});
});
