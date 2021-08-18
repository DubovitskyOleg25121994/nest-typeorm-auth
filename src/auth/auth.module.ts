import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ActivationModule } from './activation/activation.module';
import { RolesModule } from '../users/roles/roles.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [ConfigModule, JwtAuthModule, UsersModule, TokensModule, RolesModule, ActivationModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
