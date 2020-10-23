import { Context } from '../types';
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Vote } from '../entities/Vote';
import { isAuth } from '../middlewares/isAuth';
import { getConnection } from 'typeorm';

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
    await getConnection().transaction(async (tm) => {
      await tm.query(
        `insert into vote ("recipeId", "userId")
            values ($1, $2)`,
        [recipeId, req.session.userId]
      );
      await tm.query(
        `update recipe
          set "voteCount" = "voteCount" + 1
          where id = $1`,
        [recipeId]
      );
    });
    return true;
  }
}
