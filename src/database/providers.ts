import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getOrmConfig } from './database-ormconfig.constant';

config();

const { TYPEORM_HOSTS } = process.env;

export const typeORMConfigProvider = JSON.parse(TYPEORM_HOSTS).map(hostname =>
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => getOrmConfig(configService, hostname) as TypeOrmModuleOptions,
	}),
);
