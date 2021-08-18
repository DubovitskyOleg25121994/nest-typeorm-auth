import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';

import { ActivationService } from './activation/activation.service';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from './jwt/jwt.service';
import { IJwtPayload } from './jwt/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RoleService } from '../users/roles/roles.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { TokensService } from './tokens/tokens.service';
import { TokenDataDto } from './dto/token-data.dto';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtAuthService: JwtAuthService,
		private readonly usersService: UsersService,
		private readonly roleService: RoleService,
		private readonly tokensService: TokensService,
		private readonly activationService: ActivationService,
	) {}

	async login({ email, password }: LoginDto): Promise<TokenDataDto> {
		const user = await this.usersService.getUserByEmail(email);
		if (!user) {
			throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
		}
		const isCorrectPassword = await this.comparePasswords(password, user.password);
		if (!isCorrectPassword) {
			throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN);
		}
		const { roles } = user;
		const payload = {} as IJwtPayload;
		payload.email = email;
		payload.roles = roles.map(({ name }) => name);
		const accessToken = this.jwtAuthService.createAccessToken(payload);
		const refreshToken = this.tokensService.generateToken();
		const tokenData = this.jwtAuthService.getTokeData(accessToken, refreshToken);
		return tokenData;
	}

	async registration(registrationDto: RegistrationDto) {
		const { email } = registrationDto;
		const isExistUser = await this.usersService.checkUserByEmail(email);
		if (isExistUser) {
			throw new HttpException('User is already exist', HttpStatus.FORBIDDEN);
		}
		const role = await this.roleService.getRole(registrationDto.role);
		registrationDto.roleId = role.id;
		const newUser = await this.usersService.createUser(registrationDto);
		delete newUser.password;
		await this.activationService.createEmailActivation(newUser, email);
		return newUser;
	}

	async setPassword({ token, password }: SetPasswordDto) {
		const tokenData: Users = await this.tokensService.getTokenDataByKey(token);
		if (!tokenData) {
			throw new HttpException('Invalid or expired token', HttpStatus.FORBIDDEN);
		}
		const hashPassword = await this.getHashPassword(password, this.saltRounds);
		tokenData.password = hashPassword;
		await this.usersService.updateUser(tokenData);
		await this.tokensService.removeToken(token);
	}

	comparePasswords(userPassword: string, password: string): Promise<boolean> {
		return compare(userPassword, password);
	}

	getHashPassword(password: string, saltRounds: number): Promise<string> {
		return hash(password, saltRounds);
	}

	getRefreshTokenExpire() {
		return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
	}

	get saltRounds(): number {
		return Number(this.configService.get<string>('SALT_ROUNDS'));
	}
}
