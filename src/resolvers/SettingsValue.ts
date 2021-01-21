import { Context, BadRequestError } from '@via-profit-services/core';
import type { SettingsNode } from '@via-profit-services/settings-manager';

const SettingsValue = new Proxy({
  id: () => ({}),
  value: () => ({}),
  createdAt: () => ({}),
  updatedAt: () => ({}),
  owner: () => ({}),
  group: () => ({}),
  category: () => ({}),
}, {
  get: (target, prop: keyof SettingsNode) => async (
    parent: SettingsNode,
    _args: any,
    context: Context) => {
    const { services, dataloader } = context;

    const pseudoId = services.settings.dataToPseudoId(parent);
    const settingsData = await dataloader.settings.load(pseudoId);

    if (typeof settingsData === 'undefined') {
      throw new BadRequestError('SettingsManager. Settings of this params not exists', { parent });
    }

    if (typeof settingsData[prop] === 'undefined') {
      return null;
    }

    return settingsData[prop];
  },
});

export default SettingsValue;
