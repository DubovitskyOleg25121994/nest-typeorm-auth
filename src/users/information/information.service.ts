import { Injectable } from '@nestjs/common';

import { MailService } from '../mailer/mail.service';
import { getTemplateConfirmAccount, getTemplateResetPassword } from './templates';

@Injectable()
export class InformationService {
	constructor(private readonly mailService: MailService) {}

	async sendEmailConfirmAccount(email: string, link: string) {
		const templateConfirmAccount = getTemplateConfirmAccount(link);
		await this.mailService.sendMessage(email, templateConfirmAccount, 'CONFIRM ACCOUNT');
	}

	async sendEmailResetPassword(email: string, link: string) {
		const templateResetPassword = getTemplateResetPassword(link);
		await this.mailService.sendMessage(email, templateResetPassword, 'RESET PASSWORD');
	}
}
