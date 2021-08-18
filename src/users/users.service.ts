import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from './repositories/users.repository';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private readonly usersRepository: UsersRepository) {}
	getUserByEmail(email: string): Promise<Users> {
		return this.usersRepository.getUserByEmail(email);
	}

	async checkUserByEmail(email: string): Promise<boolean> {
		const user = await this.usersRepository.getUserByEmail(email);
		return !!user;
	}

	createUser(createUserDto: CreateUserDto): Promise<Users> {
		return this.usersRepository.createUser(createUserDto);
	}

	getUserByID(userId: number): Promise<Users> {
		return this.usersRepository.getUserByID(userId);
	}

	updateUser(user: Users): Promise<Users> {
		return this.usersRepository.updateUser(user);
	}
}
