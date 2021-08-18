import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailForResetPasswordDto {
	@ApiProperty({ description: 'Емейл', required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
