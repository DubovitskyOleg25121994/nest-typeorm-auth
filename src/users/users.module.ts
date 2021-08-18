import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './repositories/users.repository';
import { RestoreModule } from './restore/restore.module';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersRepository]), RestoreModule],
	controllers: [],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
