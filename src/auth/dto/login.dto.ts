import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({ description: 'Емейл', required: true })
	@IsNotEmpty()
	@IsString()
	email: string;

	@ApiProperty({ description: 'Пароль', required: true })
	@IsNotEmpty()
	@IsString()
	password: string;
}
