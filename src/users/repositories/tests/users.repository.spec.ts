import { Users } from '../../entities/users.entity';
import { Roles } from '../../entities/roles.entity';
import { UsersRepository } from '../users.repository';

const role = new Roles();
role.id = 1;
role.name = 'admin';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [role] as Roles[];
user.createdAt = new Date('2021-08-17T08:32:05.875Z');

describe('UsersRepository', () => {
	let usersRepository: UsersRepository;

	beforeEach(() => {
		usersRepository = new UsersRepository();
	});

	describe('createUser', () => {
		it('should return new user', async () => {
			jest.spyOn(usersRepository, 'save').mockResolvedValue(user);
			const response = await usersRepository.createUser(user);
			await expect(response).toEqual(user);
		});
	});

	describe('getUserByEmail', () => {
		it('should return user', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			const response = await usersRepository.getUserByEmail(user.email);
			await expect(response).toEqual(user);
		});
	});

	describe('updateUser', () => {
		it('should return updated user', async () => {
			jest.spyOn(usersRepository, 'save').mockResolvedValue(user);
			const response = await usersRepository.updateUser(user);
			await expect(response).toEqual(user);
		});
	});

	describe('getUserByID', () => {
		it('should return user by ID', async () => {
			jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
			const response = await usersRepository.getUserByID(user.id);
			await expect(response).toEqual(user);
		});
	});
});
