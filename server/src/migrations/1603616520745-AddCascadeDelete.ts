import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCascadeDelete1603616520745 implements MigrationInterface {
    name = 'AddCascadeDelete1603616520745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_860b91a98fffa51a81d25aad203"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_860b91a98fffa51a81d25aad203" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_860b91a98fffa51a81d25aad203"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_860b91a98fffa51a81d25aad203" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
