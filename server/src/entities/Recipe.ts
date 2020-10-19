import { Field } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export class Recipe extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Column()
    @Field()
    name!: string

    @ManyToOne(() => User, (user) => user.recipes)
    @Field(() => User)
    user: User

    @Column()
    @Field()
    userId: number

    @Column()
    @Field(() => [String])
    ingredients!: string[]

    @CreateDateColumn()
    @Field(() => String)
    createdAt!: Date

    @UpdateDateColumn()
    @Field(() => String)
    updatedAt!: Date

    @Column()
    @Field(() => [String])
    procedures!: string[]
}