import {MigrationInterface, QueryRunner} from "typeorm";

export class AddComment1603616385337 implements MigrationInterface {
    name = 'AddComment1603616385337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("recipeId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_11b01900f17b3175b2b1bcc2648" PRIMARY KEY ("recipeId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_860b91a98fffa51a81d25aad203" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_860b91a98fffa51a81d25aad203"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
