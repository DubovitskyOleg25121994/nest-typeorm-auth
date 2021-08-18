import { RestoreService } from '../restore.service';
import { RestoreController } from '../restore.controller';
import { SendEmailForResetPasswordDto } from '../dto/send-email-for-reset-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

const resetToken = 'resetToken';

describe('RestoreController', () => {
	let restoreService: RestoreService;
	let restoreController: RestoreController;

	beforeEach(() => {
		restoreService = new RestoreService(null, null, null, null);
		restoreController = new RestoreController(restoreService);
	});

	describe('sendEmailForResetPassword', () => {
		it('should send email for reset password', async () => {
			const sendEmailForResetPasswordDto = new SendEmailForResetPasswordDto();
			sendEmailForResetPasswordDto.email = 'test@mail.ru';
			jest.spyOn(restoreService, 'sendEmailForResetPassword').mockResolvedValue(undefined);
			const result = await restoreController.sendEmailForResetPassword(sendEmailForResetPasswordDto);
			await expect(result).toBeUndefined();
		});
	});

	describe('resetPassword', () => {
		it('should reset user password', async () => {
			const resetPasswordDto = new ResetPasswordDto();
			resetPasswordDto.token = resetToken;
			resetPasswordDto.password = '123456';
			jest.spyOn(restoreService, 'resetPassword').mockResolvedValue(undefined);
			const result = await restoreController.resetPassword(resetPasswordDto);
			await expect(result).toBeUndefined();
		});
	});
});
