import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { mailerProvider } from '../mailer/mail.provider';
import { MailService } from '../mailer/mail.service';
import { InformationService } from './information.service';

@Module({
	imports: [ConfigModule.forRoot(), mailerProvider],
	controllers: [],
	providers: [InformationService, MailService],
	exports: [InformationService],
})
export class InformationModule {}
