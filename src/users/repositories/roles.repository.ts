import { EntityRepository, ILike, Repository } from 'typeorm';

import { Roles } from '../entities/roles.entity';

@EntityRepository(Roles)
export class RolesRepository extends Repository<Roles> {
	getRole(name: string): Promise<Roles> {
		return this.findOne({ name: ILike(name) });
	}
}
