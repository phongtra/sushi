import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVote1603446122154 implements MigrationInterface {
    name = 'AddVote1603446122154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote" ("userId" integer NOT NULL, "recipeId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_9682d70a1d436f9b3ace4c51ebc" PRIMARY KEY ("userId", "recipeId"))`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_68f0f5042d416dd7369bfb67e8a" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_68f0f5042d416dd7369bfb67e8a"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }

}
