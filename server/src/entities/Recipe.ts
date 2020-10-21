import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity()
@ObjectType()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Column()
  @Field()
  name!: string;

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
}
