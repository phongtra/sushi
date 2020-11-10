import {MigrationInterface, QueryRunner} from "typeorm";

export class FixRecipeTable31605004069590 implements MigrationInterface {
    name = 'FixRecipeTable31605004069590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "image" character varying DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "image"`);
    }

}
