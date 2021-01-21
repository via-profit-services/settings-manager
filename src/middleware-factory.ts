import { collateForDataloader, Middleware, ServerError } from '@via-profit-services/core';
import type { SettingsMiddlewareFactory } from '@via-profit-services/settings-manager';
import DataLoader from 'dataloader';
import '@via-profit-services/knex';

import schemaBuilder from './schema-builder';
import SettingsManager from './SettingsManager';

const settingsMiddlewareFactory: SettingsMiddlewareFactory = async (configuration) => {

  const { settings, ownerResolver } = configuration;
  const pool: ReturnType<Middleware> = {
    context: null,
  };

  const { typeDefs, resolvers } = schemaBuilder(settings);

  const middleware: Middleware = async (props) => {
    const { context } = props;

    if (pool.context !== null) {
      return pool;
    }

    // check knex dependencies
    if (typeof context.knex === 'undefined') {
      throw new ServerError(
        '«@via-profit-services/knex» middleware is missing. If knex middleware is already connected, make sure that the connection order is correct: knex middleware must be connected before',
      );
    }

    pool.context = context;

    // Inject Settings service
    pool.context.services.settings = new SettingsManager({ context });

    // register owner resolver
    pool.context.services.settings.ownerResolver = ownerResolver;

    // check default database
    await pool.context.services.settings.writeDefaultSettings(settings);

    // init pseudoIDs dataloader
    pool.context.dataloader.settingsPseudos = new DataLoader(async (pseudoIds: string[]) => {
      const nodes = await pool.context.services.settings.resolveSettingsByPsudoIDs(pseudoIds);

      return collateForDataloader(pseudoIds, nodes);
    });

    // init standard dataloader
    pool.context.dataloader.settings = new DataLoader(async (ids: string[]) => {
      const nodes = await pool.context.services.settings.getSettingsByIds(ids);

      return collateForDataloader(ids, nodes);
    });

    return pool;
  }


  return {
    middleware,
    typeDefs,
    resolvers,
  };
}

export default settingsMiddlewareFactory;
