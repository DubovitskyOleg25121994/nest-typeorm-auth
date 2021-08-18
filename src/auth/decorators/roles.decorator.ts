import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enums/role.enums';

export const Roles = (...roles: UserRoles[]): CustomDecorator => SetMetadata('roles', roles);
