import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { UserRoles } from '../enums/role.enums';

export class RegistrationDto {
	@ApiProperty({ description: 'Емейл', required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'Имя', required: true })
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@ApiProperty({ description: 'Фамилия', required: true })
	@IsNotEmpty()
	@IsString()
	lastName: string;

	@ApiProperty({ description: 'Роль', required: true })
	@IsNotEmpty()
	@IsEnum(UserRoles)
	role: UserRoles;

	@ApiProperty({ description: 'ID роли', required: false })
	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	roleId?: number;
}
