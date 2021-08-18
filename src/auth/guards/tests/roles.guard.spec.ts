import { Reflector } from '@nestjs/core';

import { UserRoles } from '../../enums/role.enums';
import { RolesGuard } from '../roles.guard';

describe('RolesGuard', () => {
	let rolesGuard: RolesGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		rolesGuard = new RolesGuard(reflector);
	});

	it('should be defined', () => {
		expect(rolesGuard).toBeDefined();
	});

	it('should skip(return true) if the "Roles" decorator is not set', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => []);
		const context = {
			getHandler: jest.fn(),
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					user: { roles: [] },
				} as any),
			}),
			getClass: jest.fn(),
		} as any;
		const result = await rolesGuard.canActivate(context);

		expect(result).toBeTruthy();
		expect(reflector.getAllAndOverride).toBeCalled();
	});

	it('should return true if the "Roles" decorator is set', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => [UserRoles.MANAGER]);
		const context = {
			getHandler: jest.fn(),
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					user: { roles: [UserRoles.MANAGER] },
				} as any),
			}),
			getClass: jest.fn(),
		} as any;
		const result = await rolesGuard.canActivate(context);
		expect(result).toBeTruthy();
		expect(reflector.getAllAndOverride).toBeCalled();
	});

	it('should return false if the "Roles" decorator is set but role is not allowed', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => [UserRoles.ADMIN]);
		const context = {
			getHandler: jest.fn(),
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					user: { roles: [UserRoles.MANAGER] },
				} as any),
			}),
			getClass: jest.fn(),
		} as any;
		const result = await rolesGuard.canActivate(context);
		expect(result).toBeFalsy();
		expect(reflector.getAllAndOverride).toBeCalled();
	});
});
