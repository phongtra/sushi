import { Comment } from '../entities/Comment';
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Context } from '../types';
import { isAuth } from '../middlewares/isAuth';
import { User } from '../entities/User';

@Resolver()
export class CommentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async addComment(
    @Arg('recipeId', () => Int) recipeId: number,
    @Arg('content', () => String) content: string,
    @Ctx() { req }: Context
  ) {
    const user = await User.findOne({ id: req.session.userId });
    if (!user) {
      throw new Error('user does not exist');
    }
    return Comment.create({
      recipeId,
      content,
      userId: req.session.userId,
      username: user.username
    }).save();
  }
}
