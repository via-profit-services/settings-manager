import { Middleware, ServerError } from '@via-profit-services/core';
import type { SettingsMiddlewareFactory } from '@via-profit-services/settings-manager';
import DataLoader from '@via-profit/dataloader';

import schemaBuilder from './schema-builder';
import SettingsManager from './SettingsManager';

const settingsMiddlewareFactory: SettingsMiddlewareFactory = async (configuration) => {
  const { settings, ownerResolver } = configuration;
  const { typeDefs, resolvers } = schemaBuilder(settings);
  let initDefaults = false;

  const middleware: Middleware = async ({ context }) => {

    // check knex dependencies
    if (typeof context.knex === 'undefined') {
      throw new ServerError(
        '«@via-profit-services/knex» middleware is missing. If knex middleware is already connected, make sure that the connection order is correct: knex middleware must be connected before',
      );
    }
    if (typeof context.redis === 'undefined') {
      throw new ServerError(
        '«@via-profit-services/redis» middleware is missing. If Redis middleware is already connected, make sure that the connection order is correct: redis middleware must be connected before',
      );
    }

    // Inject Settings service
    context.services.settings = new SettingsManager({ context });

    // register owner resolver
    context.services.settings.ownerResolver = ownerResolver;

    // inject pseudoIDs dataloader
    context.dataloader.settingsPseudos = new DataLoader(async (pseudoIds: string[]) => {
      const nodes = await context.services.settings.getSettingsByPsudoIds(pseudoIds);

      return nodes;
    }, {
      redis: context.redis,
      cacheName: 'settings.pseudos',
      defaultExpiration: '1d',
    });

    // inject standard dataloader
    context.dataloader.settings = new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.settings.getSettingsByIds(ids);

      return nodes;
    }, {
      redis: context.redis,
      cacheName: 'settings.list',
      defaultExpiration: '1d',
    });


    // check default database
    if (!initDefaults) {
      initDefaults = true;
      await context.services.settings.writeDefaultSettings(settings);
    }

    return {
      context,
    };
  }


  return {
    middleware,
    typeDefs,
    resolvers,
  };
}

export default settingsMiddlewareFactory;
