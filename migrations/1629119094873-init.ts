import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1629119094873 implements MigrationInterface {
	name = 'init1629119094873';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2021-08-16T13:04:56.999Z"', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
		await queryRunner.query(`CREATE INDEX "IDX_ef2fb839248017665e5033e730" ON "users" ("first_name") `);
		await queryRunner.query(`CREATE INDEX "IDX_0408cb491623b121499d4fa238" ON "users" ("last_name") `);
		await queryRunner.query(`CREATE INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa" ON "users" ("created_at") `);
		await queryRunner.query(
			`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
		await queryRunner.query(
			`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
		await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(`INSERT INTO "roles" (name) VALUES ('admin');`);
		await queryRunner.query(`INSERT INTO "roles" (name) VALUES ('manager');`);
		await queryRunner.query(
			`INSERT INTO "users" (email, first_name, last_name, password) VALUES ('admin@gmail.com', 'admin', 'admin', '$2a$12$k/wj5ZQ67NL7Mym5n2Paze/HJh72gtMAGkOBe3o5AAeWVAu.3z9E6');`,
		);
		await queryRunner.query(`INSERT INTO "user_roles" (user_id,role_id) VALUES (1, 1);`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
		await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
		await queryRunner.query(`DROP INDEX "IDX_b23c65e50a758245a33ee35fda"`);
		await queryRunner.query(`DROP INDEX "IDX_87b8888186ca9769c960e92687"`);
		await queryRunner.query(`DROP TABLE "user_roles"`);
		await queryRunner.query(`DROP INDEX "IDX_648e3f5447f725579d7d4ffdfb"`);
		await queryRunner.query(`DROP TABLE "roles"`);
		await queryRunner.query(`DROP INDEX "IDX_c9b5b525a96ddc2c5647d7f7fa"`);
		await queryRunner.query(`DROP INDEX "IDX_0408cb491623b121499d4fa238"`);
		await queryRunner.query(`DROP INDEX "IDX_ef2fb839248017665e5033e730"`);
		await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
