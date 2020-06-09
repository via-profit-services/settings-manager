import {
  Node, DataLoader,
} from '@via-profit-services/core';

import SettingsService from './service';
import { ISettingsNode, Context } from './types';

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

  loaders.settings = new DataLoader<string, Node<ISettingsNode>>((pseudoIds: string[]) => {
    return service.getSettingsByPseudoIds(pseudoIds)
      .then((nodes) => {
        return pseudoIds.map((pseudoId) => {
          const {
            category, group, name, owner,
          } = SettingsService.getDataFromPseudoId(pseudoId);

          const settingsList = nodes.filter((node) => {
            return node.category === category
              && node.group === group
              && node.name === name;
          });

          // try to search settings for specified owner
          const settings = settingsList.find((s) => s.owner === owner);

          // return founded settings or default settings
          return settings || settingsList[0];
        });
      });
  });

  return loaders;
}
