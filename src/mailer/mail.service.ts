import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

	async sendMessage(email: string | string[], message: string, subject = 'PROLEUM', attachment = null) {
		await this.mailerService.sendMail({
			to: email,
			from: this.configService.get('SMTP_DOMAIN_USER'),
			subject,
			html: message,
			attachments: attachment ? [attachment] : [],
		});
	}
}
