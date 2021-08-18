import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Roles } from '../entities/roles.entity';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RoleService {
	constructor(@InjectRepository(Roles) private readonly rolesRepository: RolesRepository) {}

	getRole(role: string): Promise<Roles> {
		return this.rolesRepository.getRole(role);
	}
}
