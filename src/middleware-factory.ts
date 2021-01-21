import { Middleware, Node, ServerError } from '@via-profit-services/core';
import type { SettingsMiddlewareFactory, SettingsNode } from '@via-profit-services/settings-manager';
import DataLoader from 'dataloader';
import { v4 as uuidv4 } from 'uuid';

import staticResolvers from './resolvers';
import schemaBuilder from './schema-builder';
import staticTypeDefs from './schema.graphql';
import SettingsManager from './SettingsManager';

const settingsMiddlewareFactory: SettingsMiddlewareFactory = (configuration) => {

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

    pool.context = context;

    // Inject Settings service
    const service = new SettingsManager({ context });

    service.ownerResolver = ownerResolver;

    pool.context.services.settings = service;

    pool.context.dataloader.settings = new DataLoader<
      string,
      Node<SettingsNode>
    >(async (pseudoIds: string[]) => {
    const nodes = await pool.context.services.settings.getSettingsByPseudoIds(pseudoIds);

    const batchSettings = pseudoIds.map((pseudoId) => {
      const { category, group, name, owner } = service.getDataFromPseudoId(pseudoId);
      const settingsList = nodes.filter((node) => node.category === category
          && node.group === group
          && node.name === name);

      // try to search settings for specified owner
      const settings = settingsList.find((s) => s.owner === (owner || null));

      // if settings for specified owner not found
      // will be created new settings record
      if (!settings) {
        const newSettings: SettingsNode = {
          category,
          group,
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...settingsList[0],
          owner: owner || '',
          comment: '',
          id: uuidv4(),
        };

        if (!newSettings.category || !newSettings.group) {
          throw new ServerError('SettingsManager. Invalid settings was passed', { newSettings });
        }

        if (!owner) {
          throw new ServerError('SettingsManager. Check the global settings exist. Maybe you should to execute migrations for this', newSettings);
        }

        try {
          service.createSettings(newSettings);
        } catch (err) {
          throw new ServerError('Failed to create new settings record', { err });
        }

        return newSettings;
      }

      return settings;
    });

    return batchSettings;
  });

    return pool;
  }

  const composedResolvers = {
    ...staticResolvers,
    ...resolvers,
  };


  return {
    middleware,
    typeDefs: `${staticTypeDefs}\n\n${typeDefs}`,
    resolvers: composedResolvers,
  };
}

export default settingsMiddlewareFactory;