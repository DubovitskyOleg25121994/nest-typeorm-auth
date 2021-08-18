import { Roles } from '../../entities/roles.entity';
import { RoleService } from '../roles.service';
import { RolesRepository } from '../../repositories/roles.repository';

const role = new Roles();
role.id = 1;
role.name = 'admin';

describe('RoleService', () => {
	let roleService: RoleService;
	let rolesRepository: RolesRepository;

	beforeEach(() => {
		rolesRepository = new RolesRepository();
		roleService = new RoleService(rolesRepository);
	});

	describe('getRole', () => {
		it('should return role data', async () => {
			jest.spyOn(rolesRepository, 'getRole').mockResolvedValue(role);
			const result = await roleService.getRole(role.name);
			await expect(result).toEqual(role);
		});
	});
});
