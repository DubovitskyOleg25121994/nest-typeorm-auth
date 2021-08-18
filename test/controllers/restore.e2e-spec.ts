import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';

import { TestUtils } from '../utils/test-utils';
import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/database/database.module';
import { FakeMailService } from '../../src/users/mailer/fake-mail.service';
import { MailService } from '../../src/users/mailer/mail.service';
import { RedisModule } from '../../src/auth/redis/redis.module';
import { RedisService } from '../../src/auth/redis/redis.service';

describe('RestoreController (e2e)', () => {
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

	describe('send email for reset password (POST)', () => {
		it('should send email for reset password', async done => {
			await request
				.agent(app.getHttpServer())
				.post('/restore/send-email-for-reset-password')
				.send({ email: 'test@mail.ru' })
				.expect(201)
				.expect('');
			done();
		});

		it('should return error if email is not found', async done => {
			await request
				.agent(app.getHttpServer())
				.post('/restore/send-email-for-reset-password')
				.send({ email: 'test@mail111.ru' })
				.expect(404)
				.expect({ statusCode: 404, message: 'User is not found' });
			done();
		});
	});

	describe('reset password (PUT)', () => {
		it('should success reset password', async done => {
			const registrationDto = {
				id: 1,
				email: 'test@mail.ru',
				firstName: 'Тест',
				lastName: 'Тест',
				password: '$2a$12$2BnSYeyIpyBuMR0KA69acOrqcEWx0T3BqRAY.UJmyxWV74N9jAQM2',
			};
			const token = 'testToken';
			await redisService.setCacheByKey('testToken', registrationDto);
			await request
				.agent(app.getHttpServer())
				.put('/restore/reset-password')
				.send({ password: '1234', token })
				.expect(200)
				.expect('');

			done();
		});

		it('should return error if token invalid', async done => {
			const token = 'testToken123';
			await request
				.agent(app.getHttpServer())
				.put('/restore/reset-password')
				.send({ password: '1234', token })
				.expect(403)
				.expect({ statusCode: 403, message: 'Invalid or expired token' });

			done();
		});
	});
});
