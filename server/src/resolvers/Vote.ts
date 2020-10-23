import { Context } from '../types';
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Vote } from '../entities/Vote';
import { isAuth } from '../middlewares/isAuth';

@Resolver()
export class VoteResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async vote(
    @Arg('recipeId', () => Int) recipeId: number,
    @Ctx() { req }: Context
  ) {
    const existingVote = await Vote.findOne({
      recipeId,
      userId: req.session.userId
    });
    if (existingVote) {
      return false;
    }
    await Vote.create({ recipeId, userId: req.session.userId }).save();
    return true;
  }
}
