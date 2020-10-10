import { User } from '../entities/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { userValidator } from '../validators/userValidator';
import { UserResponse } from './objectTypes/UserResponse';
import { FieldError } from './objectTypes/FieldError';
import argon2 from 'argon2';

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async signUp(
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Arg('name', () => String, { nullable: true }) name: string,
    @Arg('dateOfBirth', () => String, { nullable: true }) dateOfBirth: string,
    @Arg('gender', () => String, { nullable: true })
    gender: 'male' | 'female' | 'other'
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
    return { user };
  }
}
