import { Roles } from '../../entities/roles.entity';
import { RolesRepository } from '../roles.repository';

const role = new Roles();
role.id = 1;
role.name = 'admin';

describe('RolesRepository', () => {
	let rolesRepository: RolesRepository;

	beforeEach(() => {
		rolesRepository = new RolesRepository();
	});

	describe('getRole', () => {
		it('should return role data', async () => {
			jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(role);
			const response = await rolesRepository.getRole(role.name);
			await expect(response).toEqual(role);
		});
	});
});
