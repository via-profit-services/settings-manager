import { collateForDataloader, Middleware, ServerError } from '@via-profit-services/core';
import type { SettingsMiddlewareFactory } from '@via-profit-services/settings-manager';
import DataLoader from 'dataloader';
import '@via-profit-services/knex';

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

    // Inject Settings service
    context.services.settings = context.services.settings ?? new SettingsManager({ context });

    // register owner resolver
    context.services.settings.ownerResolver = context.services.settings.ownerResolver ?? ownerResolver;

    // inject pseudoIDs dataloader
    context.dataloader.settingsPseudos = context.dataloader.settingsPseudos ?? new DataLoader(async (pseudoIds: string[]) => {
      const nodes = await context.services.settings.resolveSettingsByPsudoIDs(pseudoIds);

      return pseudoIds.map((pseodoID) => nodes
        .find((node) => context.services.settings.dataToPseudoId(node) === pseodoID));
    });

    // inject standard dataloader
    context.dataloader.settings = context.dataloader.settings ?? new DataLoader(async (ids: string[]) => {
      const nodes = await context.services.settings.getSettingsByIds(ids);

      return collateForDataloader(ids, nodes);
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
