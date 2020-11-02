import { User } from '../entities/User';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { userValidator } from '../validators/userValidator';
import { UserResponse } from './objectTypes/UserResponse';
import { FieldError } from './objectTypes/FieldError';
import argon2 from 'argon2';
import { Context } from '../types';
import { v4 } from 'uuid';
import { sendEmail } from '../utils/sendEmail';
import { passwordValidator } from '../validators/passwordValidator';

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email', () => String) email: string,
    @Ctx() { redis }: Context
  ) {
    const user = await User.findOne({ email });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(
      'forgot-password' + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );
    sendEmail(email, `http://localhost:3000/change-password/${token}`);
    return true;
  }
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: Context
  ): Promise<UserResponse> {
    try {
      await passwordValidator().validate(
        {
          password: newPassword
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
    const key = 'forgot-password' + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'invalid token or token expired'
          }
        ]
      };
    }
    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);
    if (!user) {
      return {
        errors: [{ field: 'token', message: 'user is no longer exist' }]
      };
    }
    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );
    redis.del(key);
    //log user in adter they changed password
    req.session.userId = user.id;
    return { user };
  }
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    console.log(req.session);
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
        dateOfBirth: dateOfBirth && Date.parse(dateOfBirth).toString(),
        gender: gender && gender
      })
      .returning('*')
      .execute();
    const user = result.raw[0] as User;
    console.log(user);
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
