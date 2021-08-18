import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesRepository } from '../repositories/roles.repository';
import { RoleService } from './roles.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([RolesRepository])],
	controllers: [],
	providers: [RoleService],
	exports: [RoleService],
})
export class RolesModule {}
