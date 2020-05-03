import { TWhereAction, ServerError } from '@via-profit-services/core';
import { IResolvers } from 'graphql-tools';
import { v4 as uuidv4 } from 'uuid';

import { Context } from '../../../context';
import SettingsService, { REDIS_FIELDNAME, REDIS_HASHNAME, ISettingsNode } from '../service';
import { TSettingsCategory } from '../types';

const resolvers: IResolvers<any, Context> = {
  Query: {
    settings: async (parent, args, context) => {
      const { redis } = context;
      const cache = await redis.hget(REDIS_HASHNAME, REDIS_FIELDNAME);

      // preload all settings
      if (cache === null) {
        const settingsService = new SettingsService({ context });
        const allSettings = await settingsService.getSettings({ limit: 1000 });
        await redis.hset(REDIS_HASHNAME, REDIS_FIELDNAME, JSON.stringify(allSettings));
      }
      return args;
    },
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
    id: () => ({}),
    value: () => ({}),
    createdAt: () => ({}),
    updatedAt: () => ({}),
    owner: () => ({}),
    group: () => ({}),
    category: () => ({}),
  }, {
    get: (target, prop: keyof ISettingsNode) => (parent: ISettingsNode) => {
      return parent[prop] || null;
    },
  }),
  SettingsMutation: {
    set: async (parent, args: UpdateArgs, context) => {
      const { redis, token, logger } = context;
      const {
        group, category, name, owner, value,
      } = args;

      const settingsService = new SettingsService({ context });

      // reset cache
      await redis.hdel(REDIS_HASHNAME, REDIS_FIELDNAME);

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

          // reload settings field
          const [createdSettingsField] = await settingsService.getSettingsByIds([
            newSettingsField.id,
          ]);

          // resolve
          return createdSettingsField;
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
    // delete: async (parent, args: DeleteArgs, context) => {
    //   const { id } = args;
    //   const { redis, token, logger } = context;
    //   const settingsService = new SettingsService({ context });

    //   await redis.hdel(REDIS_HASHNAME, REDIS_FIELDNAME);

    //   const [settingsField] = await settingsService.getSettingsByIds([id]);
    //   const tupleName =
    // `${settingsField.group}->
    // ${settingsField.category}->${settingsField.name}->owner:${settingsField.owner || 'none'}`;

    //   try {
    //     await settingsService.deleteSettings(id);
    //   } catch (err) {
    //     throw new ServerError(`Failed to delete settings ${tupleName} with id ${id}`, { err });
    //   }

    //   if (settingsField.owner) {
    //     logger.settings.info(`Account ${token.uuid} deleted personal settings ${tupleName}`,
    // { settingsID: settingsField.id });
    //   } else {
    //     logger.settings.info(`Account ${token.uuid} deleted global settings ${tupleName}`,
    // { settingsID: settingsField.id });
    //   }
    // },
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
  id: string;
}

export default resolvers;
