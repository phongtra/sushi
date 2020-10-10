import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/Hello';
import { createConnection } from 'typeorm';
import path from 'path';
import { User } from './entities/User';
import { UserResolver } from './resolvers/User';
import { userValidator } from './validators/userValidator';

const app = express();

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: 'postgresql://postgres:2606@localhost:5432/sushi',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User]
  });
  await conn.runMigrations();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res })
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('Listening on port 4000');
  });
  try {
    const validator = await userValidator().validate(
      {
        username: 'AB',
        email: 'emaill.com',
        password: '123abcA!'
      },
      { abortEarly: false }
    );
  } catch (e) {
    console.log(e);
  }
};

main();
