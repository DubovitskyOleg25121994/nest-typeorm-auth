import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ActivationService } from './activation.service';
import { TokensModule } from '../tokens/tokens.module';
import { InformationModule } from '../../mailer/information/information.module';

@Module({
	imports: [ConfigModule, TokensModule, InformationModule],
	controllers: [],
	providers: [ActivationService],
	exports: [ActivationService],
})
export class ActivationModule {}
