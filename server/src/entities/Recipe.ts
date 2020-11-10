import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';
import { Vote } from './Vote';

@Entity()
@ObjectType()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Column()
  @Field()
  name!: string;

  @Column({ nullable: true, default: '' })
  @Field()
  image: string;

  @Column('text', { array: true })
  @Field(() => [String])
  ingredients!: string[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt!: Date;

  @Column('text', { array: true })
  @Field(() => [String])
  procedures!: string[];
  @Column()
  @Field()
  chefId: number;

  @ManyToOne(() => User, (user) => user.recipes)
  @Field(() => User)
  chef: User;
  @Field()
  @Column({ default: 0 })
  voteCount: number;
  @OneToMany(() => Vote, (vote) => vote.recipe)
  votes: Vote[];
  @OneToMany(() => Comment, (comment) => comment.recipe)
  @Field(() => [Comment])
  comments: Comment[];
}
