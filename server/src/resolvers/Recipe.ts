import { Recipe } from '../entities/Recipe';
import { isAuth } from '../middlewares/isAuth';
import { Context } from '../types';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { googleStorageConnect } from '../utils/googleCloudStorageConnect';

@Resolver()
export class RecipeResolver {
  @Query(() => [Recipe])
  async list(): Promise<Recipe[]> {
    const qb = await getConnection()
      .getRepository(Recipe)
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.chef', 'user', 'user.id = r."chefId"')
      .leftJoinAndSelect('r.comments', 'comment', 'comment."recipeId" = r.id')
      .orderBy('r."createdAt"', 'DESC');
    const recipes = qb.getMany();
    return recipes;
  }
  @Query(() => Recipe, { nullable: true })
  async recipe(@Arg('id', () => Int) id: number): Promise<Recipe | undefined> {
    const qb = await getConnection()
      .getRepository(Recipe)
      .createQueryBuilder('r')
      .where('r.id = :id', { id })
      .innerJoinAndSelect('r.chef', 'user', 'user.id = r."chefId"');
    const recipe = qb.getOne();
    return recipe;
  }
  @UseMiddleware(isAuth)
  @Mutation(() => Recipe)
  async createRecipe(
    @Arg('name', () => String) name: string,
    @Arg('ingredients', () => [String]) ingredients: string[],
    @Arg('image', () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Arg('procedures', () => [String]) procedures: string[],
    @Ctx() { req }: Context
  ) {
    console.log(image);
    if (image) {
      console.log('Processing image');
      const { createReadStream, filename } = await image;
      await new Promise((res) => {
        createReadStream()
          .pipe(
            googleStorageConnect.bucket
              .file(filename)
              .createWriteStream({ resumable: false, gzip: true })
          )
          .on('finish', res);
      });
      console.log('finish');
      return Recipe.create({
        name,
        image: filename,
        ingredients,
        procedures,
        chefId: req.session.userId
      }).save();
    }
    return Recipe.create({
      name,
      image: '',
      ingredients,
      procedures,
      chefId: req.session.userId
    }).save();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Recipe, { nullable: true })
  async updateRecipe(
    @Arg('id', () => Int) id: number,
    @Arg('name', () => String) name: string,
    @Arg('ingredients', () => [String]) ingredients: string[],
    @Arg('procedures', () => [String]) procedures: string[],
    @Ctx() { req }: Context
  ) {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Recipe)
      .set({ name, ingredients, procedures })
      .where('id = :id and "chefId" = :chefId', {
        id,
        chefId: req.session.userId
      })
      .returning('*')
      .execute();
    return result.raw[0] as Recipe;
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg('id', () => Int) id: number, @Ctx() { req }: Context) {
    //not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (!post.creatorId == req.session.userId) {
    //   throw new Error('Not Authorized');
    // }
    // await Updoot.delete({ postId: id });
    await Recipe.delete({ id, chefId: req.session.userId });
    return true;
  }
}
