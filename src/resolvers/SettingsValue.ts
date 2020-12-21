import { ACCESS_TOKEN_EMPTY_UUID } from '@via-profit-services/accounts';
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
    args: any,
    context: Context) => {
    const { token, services, dataloader } = context;

    if (token.uuid === ACCESS_TOKEN_EMPTY_UUID) {
      throw new BadRequestError('SettingsManager. Missing or invalid token');
    }

    parent.owner = token.uuid;
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
