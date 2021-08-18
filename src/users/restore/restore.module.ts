import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InformationModule } from '../information/information.module';
import { TokensModule } from '../../auth/tokens/tokens.module';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';
import { UsersService } from '../users.service';
import { UsersRepository } from '../repositories/users.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UsersRepository]), ConfigModule, InformationModule, TokensModule],
	controllers: [RestoreController],
	providers: [RestoreService, UsersService],
	exports: [RestoreService],
})
export class RestoreModule {}
