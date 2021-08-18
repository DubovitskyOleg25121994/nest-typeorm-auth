import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
