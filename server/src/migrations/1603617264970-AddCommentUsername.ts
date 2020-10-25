import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCommentUsername1603617264970 implements MigrationInterface {
    name = 'AddCommentUsername1603617264970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "username"`);
    }

}
