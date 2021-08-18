import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '../enums/role.enums';
import { IJwtPayload } from '../jwt/interfaces/jwt.interface';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles.length) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const user: IJwtPayload = request.user;
		return this.matches(requiredRoles, user.roles);
	}

	matches(requiredRoles: string[], userRoles: string[]) {
		const isAdmin = userRoles.includes(UserRoles.ADMIN);
		if (isAdmin) {
			return true;
		}
		return requiredRoles.some(role => userRoles.includes(role));
	}
}
