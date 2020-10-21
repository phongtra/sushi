import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial11603277048399 implements MigrationInterface {
  name = 'Initial11603277048399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ingredients" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "procedures" text array NOT NULL, "chefId" integer NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "recipe" ADD CONSTRAINT "FK_5ffc9d86db562b0e8fb144951aa" FOREIGN KEY ("chefId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipe" DROP CONSTRAINT "FK_5ffc9d86db562b0e8fb144951aa"`
    );
    await queryRunner.query(`DROP TABLE "recipe"`);
  }
}
