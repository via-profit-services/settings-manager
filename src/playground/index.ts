/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { App, schemas } from '@via-profit-services/core';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

import * as settingsManager from '../schemas/settings-manager';
import { configureApp } from '../utils/configureApp';

const { TSettingsCategory, makeSchema } = settingsManager;


const settingsParams = makeSchema({
  layout: [
    {
      category: TSettingsCategory.ui,
      name: ['theme', 'menu', 'fontSize'],
    },
  ],
});

const config = configureApp({
  typeDefs: [
    settingsManager.typeDefs,
    settingsParams.typeDefs,
  ],
  resolvers: [
    settingsManager.resolvers,
    settingsParams.resolvers,
  ],
});
const app = new App(config);
const AuthService = schemas.auth.service;

app.bootstrap((props) => {
  const { resolveUrl, context } = props;
  if (process.env.NODE_ENV !== 'development') {
    console.log(`GraphQL server was started at ${resolveUrl.graphql}`);

    return;
  }

  console.log('');
  const authService = new AuthService({ context });
  const { accessToken } = authService.generateTokens({
    uuid: uuidv4(),
    roles: ['developer'],
  }, {
    access: 2.592e6,
    refresh: 2.592e6,
  });

  console.log(chalk.green('Your development token is:'));
  console.log(chalk.yellow(accessToken.token));
  console.log('');

  console.log('');
  console.log(chalk.green('============== Server =============='));
  console.log('');
  console.log(`${chalk.green('GraphQL server')}:     ${chalk.yellow(resolveUrl.graphql)}`);


  if (resolveUrl.voyager) {
    console.log(`${chalk.magenta('GraphQL voyager')}:    ${chalk.yellow(resolveUrl.voyager)}`);
  }

  console.log('');
});
