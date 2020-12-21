import { Context, BadRequestError } from '@via-profit-services/core';
import type { SettingsNode } from '@via-profit-services/settings';

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
    args: any,
    context: Context) => {
    const { token, services, dataloader } = context;
    parent.owner = token.uuid;

    const pseudoId = services.settings.dataToPseudoId(parent);
    const settingsData = await dataloader.settings.load(pseudoId);

    if (typeof settingsData === 'undefined') {
      throw new BadRequestError('Settings of this params not exists', { parent });
    }

    if (typeof settingsData[prop] === 'undefined') {
      return null;
    }

    return settingsData[prop];
  },
});

export default SettingsValue;
