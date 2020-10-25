import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/Hello';
import { createConnection } from 'typeorm';
import path from 'path';
import { UserResolver } from './resolvers/User';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import session from 'express-session';
import { __prod__ } from './utils/__prod';
import { Recipe } from './entities/Recipe';
import { User } from './entities/User';
import { RecipeResolver } from './resolvers/Recipe';
import { Vote } from './entities/Vote';
import { VoteResolver } from './resolvers/Vote';
import { Comment } from './entities/Comment';
import { CommentResolver } from './resolvers/Comment';

const app = express();

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url:
      'postgresql://doadmin:p1vno4h1d66axeqh@db-postgresql-fra1-80683-do-user-7422227-0.a.db.ondigitalocean.com:25060/defaultdb',
    logging: true,
    synchronize: false,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Recipe, User, Vote, Comment]
  });

  await conn.runMigrations();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__, //cookie only works in https,
        domain: __prod__ ? '.codeponder.com' : undefined
      },
      secret: 'kdksfhdskfhdskfhdsfh',
      resave: false
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        RecipeResolver,
        VoteResolver,
        CommentResolver
      ],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res, redis })
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('Listening on port 4000');
  });
};

main();
