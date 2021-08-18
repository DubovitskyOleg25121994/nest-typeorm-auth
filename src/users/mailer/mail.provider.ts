import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';

export const mailerProvider = MailerModule.forRootAsync({
	inject: [ConfigService],
	imports: [ConfigModule],
	useFactory: (config: ConfigService) => ({
		transport: {
			host: config.get('SMTP_DOMAIN'),
			port: 587,
			secure: false,
			auth: {
				user: config.get('SMTP_DOMAIN_USER'),
				pass: config.get('SMTP_DOMAIN_PASSWORD'),
			},
		},
		template: {
			dir: __dirname + '/templates',
			adapter: new HandlebarsAdapter(),
			options: {
				strict: true,
			},
		},
	}),
});
