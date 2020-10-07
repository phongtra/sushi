import { User } from '../entities/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async signUp(
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Arg('name', () => String, { nullable: true }) name: string,
    @Arg('dateOfBirth', () => String, { nullable: true }) dateOfBirth: string,
    @Arg('gender', () => String, { nullable: true }) gender: string
  ): Promise<User> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password,
        name: name && name,
        dateOfBirth: dateOfBirth && dateOfBirth,
        gender: gender && gender
      })
      .returning('*')
      .execute();
    const user = result.raw[0] as User;
    return user;
  }
}
