import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReBuild1603451790413 implements MigrationInterface {
  name = 'ReBuild1603451790413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vote" ("userId" integer NOT NULL, "recipeId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_9682d70a1d436f9b3ace4c51ebc" PRIMARY KEY ("userId", "recipeId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "dateOfBirth" TIMESTAMP, "gender" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ingredients" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "procedures" text array NOT NULL, "chefId" integer NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_68f0f5042d416dd7369bfb67e8a" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "recipe" ADD CONSTRAINT "FK_5ffc9d86db562b0e8fb144951aa" FOREIGN KEY ("chefId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipe" DROP CONSTRAINT "FK_5ffc9d86db562b0e8fb144951aa"`
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_68f0f5042d416dd7369bfb67e8a"`
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`
    );
    await queryRunner.query(`DROP TABLE "recipe"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "vote"`);
  }
}
