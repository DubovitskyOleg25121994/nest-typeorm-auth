import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';

import { TestUtils, createAuthHeader } from '../utils/test-utils';
import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/database/database.module';
import { FakeMailService } from '../../src/users/mailer/fake-mail.service';
import { MailService } from '../../src/users/mailer/mail.service';
import { UserRoles } from '../../src/auth/enums/role.enums';
import { RegistrationDto } from '../../src/auth/dto/registration.dto';
import { RedisModule } from '../../src/auth/redis/redis.module';
import { RedisService } from '../../src/auth/redis/redis.service';

describe('AuthController (e2e)', () => {
	let testUtils: TestUtils;
	let app: INestApplication;
	let redisService: RedisService;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule, DatabaseModule, AppModule, RedisModule],
			providers: [TestUtils, { provide: MailService, useClass: FakeMailService }],
		}).compile();
		testUtils = moduleFixture.get<TestUtils>(TestUtils);
		redisService = moduleFixture.get<RedisService>(RedisService);
		await testUtils.reloadFixtures();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async done => {
		await testUtils.closeDbConnection();
		done();
	});

	describe('login (POST)', () => {
		it('should success login', async done => {
			await request
				.agent(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'test@mail.ru', password: '123456' })
				.expect(201);
			done();
		});

		it('should return error if user is not found', async done => {
			await request
				.agent(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'test@mail111.ru', password: '123456' })
				.expect(404)
				.expect({ statusCode: 404, message: 'User is not found' });
			done();
		});

		it('should return error if passwrod is not correct', async done => {
			await request
				.agent(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'test@mail.ru', password: '1234' })
				.expect(403)
				.expect({ statusCode: 403, message: 'Password is not correct' });
			done();
		});
	});

	describe('registartion (POST)', () => {
		it('should success regist', async done => {
			const registrationDto = new RegistrationDto();
			registrationDto.email = 'prl@proleum.pro';
			registrationDto.firstName = 'Тест1';
			registrationDto.lastName = 'Тест2';
			registrationDto.role = UserRoles.MANAGER;

			const response = {
				id: 2,
				email: 'prl@proleum.pro',
				firstName: 'Тест1',
				lastName: 'Тест2',
				role: 'manager',
			};

			await request
				.agent(app.getHttpServer())
				.post('/auth/registration')
				.set(createAuthHeader(app, registrationDto.email))
				.send(registrationDto)
				.expect(201)
				.expect(response);
			done();
		});
	});

	describe('set password (PUT)', () => {
		it('should success set new password', async done => {
			const registrationDto = {
				id: 2,
				email: 'prl@proleum.pro',
				firstName: 'Тест1',
				lastName: 'Тест2',
				role: UserRoles.MANAGER,
			};
			const token = 'testToken';
			await redisService.setCacheByKey('testToken', registrationDto);
			await request
				.agent(app.getHttpServer())
				.put('/auth/set-password')
				.send({ password: '1234', token })
				.expect(200)
				.expect('');

			done();
		});

		it('should return error if token invalid', async done => {
			const token = 'testToken123';
			await request
				.agent(app.getHttpServer())
				.put('/auth/set-password')
				.send({ password: '1234', token })
				.expect(403)
				.expect({ statusCode: 403, message: 'Invalid or expired token' });

			done();
		});
	});
});
