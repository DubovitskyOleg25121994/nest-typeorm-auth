import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FakeMailService {
	constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

	async sendMessage() {
		return true;
	}
}
