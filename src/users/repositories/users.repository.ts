import { EntityRepository, Repository } from 'typeorm';

import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
	createUser(user): Promise<Users> {
		return this.save({ ...user, roles: [{ id: user.roleId }] });
	}

	getUserByEmail(email: string): Promise<Users> {
		return this.findOne({
			where: {
				email,
			},
			relations: ['roles'],
		});
	}

	updateUser(params): Promise<Users> {
		return this.save({ ...params });
	}

	getUserByID(id: number): Promise<Users> {
		return this.findOne({ id });
	}
}
