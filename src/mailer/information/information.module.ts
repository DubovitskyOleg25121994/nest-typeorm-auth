import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { mailerProvider } from '../mail.provider';
import { MailService } from '../mail.service';
import { InformationService } from './information.service';

@Module({
	imports: [ConfigModule.forRoot(), mailerProvider],
	controllers: [],
	providers: [InformationService, MailService],
	exports: [InformationService],
})
export class InformationModule {}
