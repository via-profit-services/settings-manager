import { TWhereAction, ServerError, BadRequestError } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';

import createLoaders from '../loaders';
import SettingsService from '../service';
import {
  TSettingsCategory, Context, ISettingsNode, ISettingsParsed,
} from '../types';

const resolvers: IResolvers<any, Context> = {
  Query: {
    settings: async (parent, args) => args,
  },
  Mutation: {
    settings: () => ({}),
  },
  SettingsCollection: {
    common: () => ({}),
  },
  SettingsCommonGroup: {
    contact: () => ({}),
  },
  SettingsCommonFields: {
    developer: () => 'Via Profit',
  },
  SettingsValue: new Proxy({
    value: () => ({}),
    createdAt: () => ({}),
    updatedAt: () => ({}),
    owner: () => ({}),
    group: () => ({}),
    category: () => ({}),
  }, {
    get: (target, prop: keyof ISettingsNode) => async (
      parent: ISettingsNode,
      args: any,
      context: Context) => {
      const pseudoId = SettingsService.DataToPseudoId(parent);
      const loaders = createLoaders(context);
      const settingsData = await loaders.settings.load(pseudoId);

      if (typeof settingsData === 'undefined') {
        const { logger } = context;

        logger.settings.error(`Attempt to get a nonexistent field with pseudoId ${pseudoId}`, { parent });
        throw new BadRequestError('Settings of this params not exists', { parent });
      }

      if (typeof settingsData[prop] === 'undefined') {
        return null;
      }

      return settingsData[prop];
    },
  }),
  SettingsMutation: {
    set: async (parent, args: UpdateArgs, context) => {
      const { token, logger } = context;
      const {
        group, category, name, owner, value,
      } = args;

      const pseudoId = SettingsService.DataToPseudoId(args as ISettingsParsed);
      const loaders = createLoaders(context);
      loaders.settings.clear(pseudoId);

      const settingsService = new SettingsService({ context });


      // get old settings if exist
      const [settingsField] = await settingsService.getSettings({
        limit: 1,
        where: [
          ['group', TWhereAction.EQ, group],
          ['category', TWhereAction.EQ, category],
          ['name', TWhereAction.EQ, name],
          ['owner', owner ? TWhereAction.EQ : TWhereAction.NULL, owner],
        ],
      });

      const tupleName = `${group}->${category}->${name}->owner:${owner || 'none'}`;

      // create settings if not exists
      if (!settingsField) {
        try {
          const newSettingsField = {
            id: uuidv4(),
            group,
            category,
            name,
            owner: owner || null,
            value,
          };
          await settingsService.createSettings(newSettingsField);

          if (newSettingsField.owner) {
            logger.settings.info(`Account ${token.uuid} created new personal settings ${tupleName} to set «${JSON.stringify(value)}»`, { settingsID: newSettingsField.id });
          } else {
            logger.settings.info(`Account ${token.uuid} created new global settings ${tupleName} to set ${JSON.stringify(value)}`, { settingsID: newSettingsField.id });
          }

          return args;
        } catch (err) {
          throw new ServerError('Failed to create settings', { err });
        }
      } else {
        // update settings
        try {
          await settingsService.updateSettings(settingsField.id, { value });

          if (settingsField.owner) {
            logger.settings.info(`Account ${token.uuid} updated personal settings ${tupleName} to set «${JSON.stringify(value)}»`, { settingsID: settingsField.id });
          } else {
            logger.settings.info(`Account ${token.uuid} updated global settings ${tupleName} to set ${JSON.stringify(value)}`, { settingsID: settingsField.id });
          }

          const [newSettingsField] = await settingsService.getSettingsByIds([settingsField.id]);
          return newSettingsField;
        } catch (err) {
          throw new ServerError(`Failed to update settings with id ${settingsField.id}`, { err });
        }
      }
    },
    delete: async (parent, args: DeleteArgs, context) => {
      const {
        category, group, owner, name,
      } = args;
      const { token, logger } = context;
      const settingsService = new SettingsService({ context });
      const tupleName = `${group}->${category}->${name}->owner:${owner || 'none'}`;
      const loaders = createLoaders(context);
      const pseudoId = SettingsService.DataToPseudoId({
        category, group, owner, name,
      });


      const settingsData = await settingsService.getSettingsByPseudoId(pseudoId);
      if (!settingsData) {
        throw new ServerError(`Settings with tuple ${tupleName} not found`);
      }

      loaders.settings.clear(pseudoId);

      try {
        await settingsService.deleteSettings(settingsData.id);
      } catch (err) {
        throw new ServerError(
          `Failed to delete settings ${tupleName} with id ${settingsData.id}`,
          { err },
        );
      }

      if (settingsData.owner) {
        logger.settings.info(`Account ${token.uuid} deleted personal settings ${tupleName}`,
          { settingsID: settingsData.id });
      } else {
        logger.settings.info(`Account ${token.uuid} deleted global settings ${tupleName}`,
          { settingsID: settingsData.id });
      }

      return true;
    },
  },
};


interface UpdateArgs {
  group: string;
  category: TSettingsCategory;
  name: string;
  value: any;
  owner?: string;
}
interface DeleteArgs {
  group: string;
  category: TSettingsCategory;
  name: string;
  owner: string;
}

export default resolvers;
