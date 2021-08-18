import { ApiProperty } from '@nestjs/swagger';

import { UserRoles } from '../enums/role.enums';

export class RegistrationResponseDto {
	@ApiProperty({ description: 'ID' })
	id: number;

	@ApiProperty({ description: 'Емейл' })
	email: string;

	@ApiProperty({ description: 'Имя' })
	firstName: string;

	@ApiProperty({ description: 'Фамилия' })
	lastName: string;

	@ApiProperty({ description: 'Роль' })
	role: UserRoles;

	toJSON() {
		return {
			id: this.id,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			role: this.role,
		};
	}
}
