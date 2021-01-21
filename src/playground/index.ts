/* eslint-disable import/max-dependencies */
/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as core from '@via-profit-services/core';
import * as knex from '@via-profit-services/knex';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

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
    ownerResolver: () => '270fedda-81ba-4e5a-b3e1-098c155a0a33',
    settings: {
      layout: [{
        category: 'ui',
        name: ['theme', 'fontSize'],
      }],
    },
  })

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
      settings.middleware,
    ],
  });

  app.use(graphQLExpress);
  server.listen(PORT, () => {
    console.log(`GraphQL Server started at http://localhost:${PORT}/graphql`);
  })

})();
