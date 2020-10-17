import { User } from '../entities/User';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { userValidator } from '../validators/userValidator';
import { UserResponse } from './objectTypes/UserResponse';
import { FieldError } from './objectTypes/FieldError';
import argon2 from 'argon2';
import { Context } from '../types';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne({ id: req.session.userId });
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise<Boolean>((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie('qid');
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse)
  async signUp(
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Arg('name', () => String, { nullable: true }) name: string,
    @Arg('dateOfBirth', () => String, { nullable: true }) dateOfBirth: string,
    @Arg('gender', () => String, { nullable: true })
    gender: 'male' | 'female' | 'other',
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];
    try {
      await userValidator().validate(
        {
          username,
          email,
          password
        },
        { abortEarly: false }
      );
    } catch (e) {
      const errorsForm: FieldError[] = [];
      e.inner.forEach((error: any) => {
        errorsForm.push({ field: error.path, message: error.errors[0] });
      });
      return { errors: errorsForm };
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errors.push({ field: 'email', message: 'email is already exist' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      errors.push({ field: 'username', message: 'username is already exist' });
    }
    if (errors.length) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(password);
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password: hashedPassword,
        name: name && name,
        dateOfBirth: dateOfBirth && dateOfBirth,
        gender: gender && gender
      })
      .returning('*')
      .execute();
    const user = result.raw[0] as User;
    req.session.userId = user.id;
    return { user };
  }
  @Mutation(() => UserResponse)
  async signin(
    @Arg('usernameOrEmail', () => String) usernameOrEmail: string,
    @Arg('password', () => String) password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          { field: 'password', message: "user doesn't exist or wrong password" }
        ]
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          { field: 'password', message: "user doesn't exist or wrong password" }
        ]
      };
    }
    req.session.userId = user.id;
    return { user };
  }
}
