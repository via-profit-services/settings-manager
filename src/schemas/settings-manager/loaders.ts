import {
  Node, DataLoader,
} from '@via-profit-services/core';
import { v4 as uuidv4 } from 'uuid';

import SettingsService from './service';
import { ISettingsNode, Context, ExtendedContext } from './types';

interface Loaders {
  settings: DataLoader<string, Node<ISettingsNode>>;
}

const loaders: Loaders = {
  settings: null,
};

export default function createLoaders(context: Context) {
  if (loaders.settings !== null) {
    return loaders;
  }

  const service = new SettingsService({ context });

  loaders.settings = new DataLoader<string, Node<ISettingsNode>>(async (pseudoIds: string[]) => {
    const nodes = await service.getSettingsByPseudoIds(pseudoIds);

    const batchSettings = pseudoIds.map((pseudoId) => {
      const {
        category, group, name, owner,
      } = SettingsService.getDataFromPseudoId(pseudoId);

      const settingsList = nodes.filter((node) => node.category === category
          && node.group === group
          && node.name === name);

      // try to search settings for specified owner
      const settings = settingsList.find((s) => s.owner === owner);

      if (!settings) {
        const newSettings: ISettingsNode = {
          category,
          group,
          value: null,
          ...settingsList[0],
          owner,
          comment: '',
          id: uuidv4(),
        };

        if (!newSettings.category || newSettings.group) {
          const { logger } = context as ExtendedContext;
          logger.settings.error('Invalid settings was passed', { newSettings });

          return newSettings;
        }

        service.createSettings(newSettings);

        return newSettings;
      }


      return settings;
    });

    return batchSettings;
  });

  return loaders;
}
