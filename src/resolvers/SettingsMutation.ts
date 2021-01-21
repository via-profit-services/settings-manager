import { IObjectTypeResolver, IFieldResolver } from '@graphql-tools/utils';
import { Context, ServerError } from '@via-profit-services/core';
import type { SettingsCategory, SettingsNode, SettingsParsed } from '@via-profit-services/settings-manager';
import { v4 as uuidv4 } from 'uuid';

interface UpdateArgs {
  group: string;
  category: SettingsCategory;
  name: string;
  value: any;
  id?: string;
}
interface DeleteArgs {
  id: string;
}

const setResolver: IFieldResolver<any, Context, UpdateArgs> = async (_parent, args, context) => {
  const { services, dataloader, logger } = context;
  const { id, group, category, name, value } = args;

  const owner = services.settings.ownerResolver(context);
  const pseudoId = services.settings.dataToPseudoId({
    group,
    category,
    name,
    owner,
  });

  dataloader.settings.clear(pseudoId);

  // get old settings if exist
  const [settingsField] = await services.settings.getSettings({
    limit: 1,
    where: [
      ['group', '=', group],
      ['category', '=', category],
      ['name', '=', name],
      ['owner', owner ? '=' : 'is null', owner],
    ],
  });

  const tupleName = `${group}->${category}->${name}->owner:${owner || 'none'}`;

  // create settings if not exists
  if (!settingsField) {
    try {
      const newSettingsField: Omit<SettingsNode, 'createdAt' | 'updatedAt'> = {
        id: id || uuidv4(),
        group,
        category,
        name,
        owner: owner || null,
        comment: '',
        value,
      };
      logger.server.debug(`Settings for tuple ${tupleName} not found. Need to create new record`, { group, category, name, owner });
      await services.settings.createSettings(newSettingsField);

      return args;
    } catch (err) {
      throw new ServerError('SettingsManager. Failed to create settings', { err });
    }
  } else {
    // update settings
    try {
      await services.settings.updateSettings(settingsField.id, { value });

      const [newSettingsField] = await services.settings.getSettingsByIds([settingsField.id]);

      return newSettingsField;
    } catch (err) {
      throw new ServerError(`SettingsManager. Failed to update settings with id ${settingsField.id}`, { err });
    }
  }
}

const deleteResolver: IFieldResolver<any, Context, DeleteArgs> = async (_parent, args, context) => {
  const { id } = args;
  const { services, dataloader } = context;

  const owner = services.settings.ownerResolver(context);
  const [settingsField] = await services.settings.getSettingsByIds([id]);
  settingsField.owner = owner;
  const tupleName = `${settingsField.group}->${settingsField.category}->${settingsField.name}->owner:${settingsField.owner || 'none'}`;
  const pseudoId = services.settings.dataToPseudoId(settingsField as SettingsParsed);

  dataloader.settings.clear(pseudoId);

  try {
    await services.settings.deleteSettings(id);
  } catch (err) {
    throw new ServerError(`SettingsManager. Failed to delete settings ${tupleName} with id ${id}`, { err });
  }

  return true;
}

const SettingsMutation: IObjectTypeResolver<any, Context> = {
  set: setResolver,
  delete: deleteResolver,
};

export default SettingsMutation;
