import { UsersRepository } from '../repositories/users.repository';
import { Roles } from '../entities/roles.entity';
import { Users } from '../entities/users.entity';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRoles } from '../../auth/enums/role.enums';

const role = new Roles();
role.id = 2;
role.name = 'manager';

const user = new Users();
user.id = 1;
user.email = 'test@mail.ru';
user.firstName = 'test1';
user.lastName = 'test2';
user.roles = [role] as Roles[];
user.createdAt = new Date('2021-08-17T08:32:05.875Z');

const createUserDto = new CreateUserDto();
createUserDto.email = user.email;
createUserDto.firstName = user.firstName;
createUserDto.lastName = user.lastName;
createUserDto.role = UserRoles.MANAGER;

describe('UsersService', () => {
	let usersRepository: UsersRepository;
	let usersService: UsersService;

	beforeEach(() => {
		usersRepository = new UsersRepository();
		usersService = new UsersService(usersRepository);
	});

	describe('getUserByEmail', () => {
		it('should return user data', async () => {
			jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(user);
			const response = await usersService.getUserByEmail(user.email);
			expect(response).toEqual(user);
		});
	});

	describe('checkUserByEmail', () => {
		it('should return true', async () => {
			jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(user);
			const response = await usersService.checkUserByEmail(user.email);
			expect(response).toBeTruthy();
		});

		it('should return false', async () => {
			jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(undefined);
			const response = await usersService.checkUserByEmail(user.email);
			expect(response).toBeFalsy();
		});
	});

	describe('createUser', () => {
		it('should return new user', async () => {
			jest.spyOn(usersRepository, 'createUser').mockResolvedValue(user);
			const response = await usersService.createUser(createUserDto);
			expect(response).toEqual(user);
		});
	});

	describe('getUserByID', () => {
		it('should return user data', async () => {
			jest.spyOn(usersRepository, 'getUserByID').mockResolvedValue(user);
			const response = await usersService.getUserByID(user.id);
			expect(response).toEqual(user);
		});
	});

	describe('updateUser', () => {
		it('should return updated user data', async () => {
			jest.spyOn(usersRepository, 'updateUser').mockResolvedValue(user);
			const response = await usersService.updateUser(user);
			expect(response).toEqual(user);
		});
	});
});
