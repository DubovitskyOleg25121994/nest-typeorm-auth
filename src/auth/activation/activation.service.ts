import { Injectable } from '@nestjs/common';

import { TokensService } from '../tokens/tokens.service';
import { InformationService } from '../../users/information/information.service';
import { Users } from '../../users/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActivationService {
	constructor(
		private readonly tokensService: TokensService,
		private readonly informationService: InformationService,
		private readonly configService: ConfigService,
	) {}

	async createEmailActivation(user: Users, email: string): Promise<void> {
		const activationToken = this.tokensService.generateToken();
		await this.tokensService.addTokenInRedis(activationToken, user);
		const link = this.generateActivationLink(activationToken);
		await this.informationService.sendEmailConfirmAccount(email, link);
	}

	generateActivationLink(token: string) {
		return `${this.UI_URL}/set-password?token=${token}`;
	}

	get UI_URL(): string {
		return this.configService.get<string>('UI_URL');
	}
}
