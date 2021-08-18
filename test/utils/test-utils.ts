import { INestApplication, Injectable } from '@nestjs/common';
import { Connection, Entity, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as Path from 'path';

export const createAuthHeader = (app: INestApplication, email: string) => {
	const jwtService = app.get(JwtService);
	const jwtToken = jwtService.sign({ email, roles: ['admin'] });
	return { authorization: `bearer ${jwtToken}` };
};

@Injectable()
export class TestUtils {
	connection: Connection;

	constructor(connection: Connection) {
		if (process.env.NODE_ENV !== 'test') {
			throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
		}
		this.connection = connection;
	}

	async getRepository<T>(entity: typeof Entity): Promise<Repository<T>> {
		return this.connection.getRepository(entity);
	}

	async shutdownServer(server) {
		await server.httpServer.close();
		await this.closeDbConnection();
	}

	async closeDbConnection() {
		const connection = await this.connection;
		if (connection.isConnected) {
			await this.connection.close();
		}
	}

	getOrder(entityName) {
		const order: string[] = JSON.parse(fs.readFileSync(Path.join(__dirname, '../fixtures/_order.json'), 'utf8'));
		return order.indexOf(entityName);
	}

	async getEntities() {
		const entities = [];
		(await this.connection.entityMetadatas).forEach(x =>
			entities.push({ name: x.name, tableName: x.tableName, order: this.getOrder(x.name) }),
		);
		return entities;
	}

	async reloadFixtures() {
		const entities = await this.getEntities();
		await this.cleanAll();
		await this.loadAll(entities);
	}

	async cleanAll() {
		try {
			await this.connection.synchronize(true);
		} catch (error) {
			throw new Error(`ERROR: Cleaning test db: ${error}`);
		}
	}

	async loadAll(entities: any[]) {
		try {
			for (const entity of entities.sort((a, b) => a.order - b.order)) {
				const repository = await this.getRepository(entity.name);
				const fixtureFile = Path.join(__dirname, `../fixtures/${entity.name}.json`);
				if (fs.existsSync(fixtureFile)) {
					const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
					await repository.createQueryBuilder(entity.name).insert().values(items).execute();
				}
			}
		} catch (error) {
			throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixtures on test db: ${error}`);
		}
	}
}
