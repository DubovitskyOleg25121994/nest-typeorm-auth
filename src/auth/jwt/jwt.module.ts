import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthService } from './jwt.service';
import { JwtAuthStrategy } from '../strategies/jwt.strategy';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [JwtAuthStrategy, JwtAuthService],
	exports: [JwtAuthService],
})
export class JwtAuthModule {}
