import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './Comment';
import { Recipe } from './Recipe';
import { Vote } from './Vote';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  dateOfBirth: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  gender: string;
  @OneToMany(() => Recipe, (recipe) => recipe.chef)
  recipes: Recipe[];
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
