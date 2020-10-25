import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCommentContent1603616674436 implements MigrationInterface {
    name = 'AddCommentContent1603616674436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "content" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "content"`);
    }

}
