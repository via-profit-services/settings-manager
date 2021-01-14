/* eslint-disable import/max-dependencies */
/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as accounts from '@via-profit-services/accounts';
import * as core from '@via-profit-services/core';
import * as knex from '@via-profit-services/knex';
import * as redis from '@via-profit-services/redis';
import * as sms from '@via-profit-services/sms';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';

import settingsFactory from '../index';

dotenv.config();

const PORT = 9005;
const app = express();
const server = http.createServer(app);
(async () => {

  const knexMiddleware = knex.factory({
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  });

  const settings = settingsFactory({
    settings: {
      layout: [{
        category: 'ui',
        name: ['theme', 'fontSize'],
      }],
    },
  })

  const redisMiddleware = redis.factory({
    host: 'localhost',
    db: 3,
    password: '',
  });

  const smsMiddleware = sms.factory({
    provider: 'smsc.ru',
    login: '',
    password: '',
  });

  const accountsMiddleware = await accounts.factory({
    accessTokenExpiresIn: 60 * 60 * 24 * 30,
    privateKey: path.resolve(__dirname, './jwtRS256.key'),
    publicKey: path.resolve(__dirname, './jwtRS256.key.pub'),
    enableIntrospection: true,
    defaultAccess: 'grant',
    defaultPermissions: accounts.DEFAULT_PERMISSIONS,
  });

  const schema = makeExecutableSchema({
    typeDefs: [
      core.typeDefs,
      accounts.typeDefs,
      settings.typeDefs,
    ],
    resolvers: [
      core.resolvers,
      accounts.resolvers,
      settings.resolvers,
    ],
  });


  const { graphQLExpress } = await core.factory({
    server,
    schema,
    debug: true,
    middleware: [
      knexMiddleware,
      redisMiddleware,
      smsMiddleware,
      accountsMiddleware,
      settings.middleware,
    ],
  });

  app.use(graphQLExpress);
  server.listen(PORT, () => {
    console.log(`GraphQL Server started at http://localhost:${PORT}/graphql`);
  })

})();
