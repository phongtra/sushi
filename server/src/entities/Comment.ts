import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './Recipe';
import { User } from './User';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @ManyToOne(() => Recipe, (recipe) => recipe.comments, { onDelete: 'CASCADE' })
  recipe: Recipe;
  @PrimaryColumn()
  recipeId: number;
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
  @PrimaryColumn()
  userId: number;
  @Column()
  @Field()
  username: string;
  @Column()
  @Field()
  content: string;
}
