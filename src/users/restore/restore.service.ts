import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

import { UsersService } from '../users.service';
import { InformationService } from '../information/information.service';
import { TokensService } from '../../auth/tokens/tokens.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class RestoreService {
	constructor(
		private readonly usersService: UsersService,
		private readonly informationService: InformationService,
		private readonly tokensService: TokensService,
		private readonly configService: ConfigService,
	) {}

	async sendEmailForResetPassword(email: string) {
		const user = await this.usersService.getUserByEmail(email);
		if (!user) {
			throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
		}
		delete user.password;
		const resetToken = this.tokensService.generateToken();
		await this.tokensService.addTokenInRedis(resetToken, user);
		const link = this.getneratResetPasswordLink(resetToken);
		await this.informationService.sendEmailResetPassword(email, link);
	}

	async resetPassword({ token, password }: ResetPasswordDto) {
		const tokenData: Users = await this.tokensService.getTokenDataByKey(token);
		if (!tokenData) {
			throw new HttpException('Invalid or expired token', HttpStatus.FORBIDDEN);
		}
		const hashPassword = await this.getHashPassword(password, this.saltRounds);
		tokenData.password = hashPassword;
		await this.usersService.updateUser(tokenData);
		await this.tokensService.removeToken(token);
	}

	getneratResetPasswordLink(token: string) {
		return `${this.UI_URL}/reset-password?token=${token}`;
	}

	getHashPassword(password: string, saltRounds: number): Promise<string> {
		return hash(password, saltRounds);
	}

	get UI_URL(): string {
		return this.configService.get<string>('UI_URL');
	}

	get saltRounds(): number {
		return Number(this.configService.get<string>('SALT_ROUNDS'));
	}
}
