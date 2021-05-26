/* eslint-disable import/max-dependencies */
/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as core from '@via-profit-services/core';
import * as knex from '@via-profit-services/knex';
import * as redis from '@via-profit-services/redis';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import settingsFactory from '../index';

dotenv.config();

const PORT = 9005;
const app = express();
const server = http.createServer(app);
(async () => {

  const redisMiddleware = redis.factory();

  const knexMiddleware = knex.factory({
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  });

  const settings = await settingsFactory({
    ownerResolver: () => '270fedda-81ba-4e5a-b3e1-098c155a0a33',
    settings: {
      uiweb: {
        theme: {
          enum: ['standardDark', 'standard'],
          defaultValue: 'standard',
        },
        locale: {
          enum: ['ru', 'en'],
          defaultValue: 'ru',
        },
        fontSize: {
          enum: ['small', 'default', 'normal', 'medium', 'large', 'giant'],
          defaultValue: 'default',
        },
        drawer: {
          bool: true,
          defaultValue: true,
        },
      },
      uimobile: {
        theme: {
          enum: ['standardDark', 'standard'],
          defaultValue: 'standard',
        },
        locale: {
          enum: ['ru', 'en'],
          defaultValue: 'ru',
        },
        fontSize: {
          enum: ['small', 'default', 'normal', 'medium', 'large', 'giant'],
          defaultValue: 'default',
        },
      },
      legalEntities: {
        company: {
          string: true,
          defaultValue: '[]',
        },
      },
      misc: {
        driverSalaryKmFactor: {
          int: true,
          defaultValue: 1.5,
        },
      },
    },
  });


  const schema = makeExecutableSchema({
    typeDefs: [
      core.typeDefs,
      settings.typeDefs,
    ],
    resolvers: [
      core.resolvers,
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
      settings.middleware,
    ],
  });

  app.use('/graphql', graphQLExpress);
  server.listen(PORT, () => {
    console.log(`GraphQL Server started at http://localhost:${PORT}/graphql`);
  })

})();
