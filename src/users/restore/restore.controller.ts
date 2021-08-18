import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RestoreService } from './restore.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendEmailForResetPasswordDto } from './dto/send-email-for-reset-password.dto';

@ApiTags('Восстановление доступа к учетной записе')
@Controller('restore')
export class RestoreController {
	constructor(private readonly restoreService: RestoreService) {}

	@ApiOperation({
		summary: 'Отправить емейл для сброса пароля',
	})
	@Post('send-email-for-reset-password')
	sendEmailForResetPassword(@Body() { email }: SendEmailForResetPasswordDto) {
		return this.restoreService.sendEmailForResetPassword(email);
	}

	@ApiOperation({
		summary: 'Установить новый пароль',
	})
	@Put('reset-password')
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.restoreService.resetPassword(resetPasswordDto);
	}
}
