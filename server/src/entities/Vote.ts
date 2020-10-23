import { ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './Recipe';
import { User } from './User';

@Entity()
@ObjectType()
export class Vote extends BaseEntity {
  @ManyToOne(() => User, (user) => user.votes)
  user: User;
  @ManyToOne(() => Recipe, (recipe) => recipe.votes, { onDelete: 'CASCADE' })
  recipe: Recipe;
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  recipeId: number;
}
