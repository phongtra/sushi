import {MigrationInterface, QueryRunner} from "typeorm";

export class DropValue1603455761962 implements MigrationInterface {
    name = 'DropValue1603455761962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "value"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" ADD "value" integer NOT NULL`);
    }

}
