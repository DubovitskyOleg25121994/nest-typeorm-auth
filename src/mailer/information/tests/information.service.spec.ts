import { InformationService } from '../information.service';
import { MailService } from '../../mailer/mail.service';

const link = 'link';
const email = 'manager@proleum.ro';

describe('InformationService', () => {
	let mailService: MailService;
	let informationService: InformationService;

	beforeEach(() => {
		mailService = new MailService(null, null);
		informationService = new InformationService(mailService);
	});

	describe('sendEmailConfirmAccount', () => {
		it('should send email confirm account', async () => {
			jest.spyOn(mailService, 'sendMessage').mockResolvedValue(undefined);
			const result = await informationService.sendEmailConfirmAccount(email, link);
			await expect(result).toBeUndefined();
		});
	});

	describe('sendEmailResetPassword', () => {
		it('should send email reset password', async () => {
			jest.spyOn(mailService, 'sendMessage').mockResolvedValue(undefined);
			const result = await informationService.sendEmailResetPassword(email, link);
			await expect(result).toBeUndefined();
		});
	});
});
