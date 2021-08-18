import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';

import { MailService } from '../mail.service';

const options = {
	transport: {
		host: 'test',
		port: 587,
		secure: false,
		auth: {
			user: 'test',
			pass: 'test',
		},
	},
};
describe('MailService', () => {
	let configService: ConfigService;
	let mailerService: MailerService;
	let mailService: MailService;

	beforeEach(() => {
		configService = new ConfigService({ SMTP_DOMAIN_USER: 'test@test.com' });
		mailerService = new MailerService(options);
		mailService = new MailService(mailerService, configService);
	});

	describe('sendMessage', () => {
		it('should sendMessage', async () => {
			jest.spyOn(mailerService, 'sendMail').mockResolvedValue(true as any);
			mailService.sendMessage('name@mail.ru', 'test');
			expect(mailerService.sendMail).toBeCalledTimes(1);
			expect(mailerService.sendMail).toHaveBeenCalledWith({
				attachments: [],
				from: 'test@test.com',
				html: 'test',
				subject: 'PROLEUM',
				to: 'name@mail.ru',
			});
		});

		it('should sendMessage with attachments', async () => {
			jest.spyOn(mailerService, 'sendMail').mockResolvedValue(true as any);
			mailService.sendMessage('name@mail.ru', 'test', 'PROLEUM', {
				filename: 'text1.txt',
				content: 'hello world!',
			});
			expect(mailerService.sendMail).toBeCalledTimes(1);
			expect(mailerService.sendMail).toHaveBeenCalledWith({
				attachments: [{ filename: 'text1.txt', content: 'hello world!' }],
				from: 'test@test.com',
				html: 'test',
				subject: 'PROLEUM',
				to: 'name@mail.ru',
			});
		});
	});
});
