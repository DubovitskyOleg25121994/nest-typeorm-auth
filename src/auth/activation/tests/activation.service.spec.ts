import { ConfigService } from '@nestjs/config';

import { ActivationService } from '../activation.service';
import { Users } from '../../../users/entities/users.entity';
import { Roles } from '../../../users/entities/roles.entity';
import { TokensService } from '../../tokens/tokens.service';
import { InformationService } from '../../../users/information/information.service';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [{ id: 1, name: 'admin' }] as Roles[];
user.createdAt = new Date();

const activationToken = 'activationToken';

describe('ActivationService', () => {
	let activationService: ActivationService;
	let tokensService: TokensService;
	let informationService: InformationService;
	let configService: ConfigService;

	beforeEach(() => {
		tokensService = new TokensService(null);
		informationService = new InformationService(null);
		configService = new ConfigService({ UI_URL: 'http://localhost:3000' });
		activationService = new ActivationService(tokensService, informationService, configService);
	});

	describe('createEmailActivation', () => {
		it('should send activation token by email', async () => {
			jest.spyOn(tokensService, 'generateToken').mockReturnValue(activationToken);
			jest.spyOn(tokensService, 'addTokenInRedis').mockResolvedValue(undefined);
			jest.spyOn(informationService, 'sendEmailConfirmAccount').mockResolvedValue(undefined);
			const result = await activationService.createEmailActivation(user, user.email);
			await expect(result).toBeUndefined();
		});
	});
});
