import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({ description: 'Токен', required: true })
	@IsNotEmpty()
	@IsString()
	token: string;

	@ApiProperty({ description: 'Пароль', required: true })
	@IsNotEmpty()
	@IsString()
	password: string;
}
