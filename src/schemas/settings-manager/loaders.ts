import {
  Node, DataLoader, collateForDataloader,
} from '@via-profit-services/core';
import { Context } from '../../context';
import SettingsService, { SettingsNode } from './service';

interface Loaders {
  settings: DataLoader<string, SettingsNode>;
}

const loaders: Loaders = {
  settings: null,
};


export default function createLoaders(context: Context) {
  if (loaders.settings !== null) {
    return loaders;
  }

  const service = new SettingsService({ context });

  // eslint-disable-next-line arrow-body-style
  loaders.settings = new DataLoader<string, Node<SettingsNode>>((ids: string[]) => {
    return service.getSettingsByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes));
  });

  return loaders;
}
