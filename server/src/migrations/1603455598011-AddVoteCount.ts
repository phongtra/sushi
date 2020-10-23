import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVoteCount1603455598011 implements MigrationInterface {
    name = 'AddVoteCount1603455598011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "voteCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "voteCount"`);
    }

}
