import { ServerError } from '@via-profit-services/core';
import type { Resolvers, MutationResolver, SchemaBuilderParams } from '@via-profit-services/settings-manager';


const buildResolver = (props: SchemaBuilderParams['mutation']) => {
  const { categories, names } = props;


  const mutationResolver: MutationResolver = async (parent, args, context, info) => {
    const { services, dataloader } = context;
    const { category } = parent;
    const name = info.fieldName;
    const { value } = args;
    const owner = services.settings.ownerResolver(context);
    const pseudoId = services.settings.dataToPseudoId({ category, name, owner });

    dataloader.settingsPseudos.clear(pseudoId);

    // get old settings if exist
    const [settingsField] = await services.settings.getSettings({
      limit: 1,
      where: [
        ['category', '=', category],
        ['name', '=', name],
        ['owner', owner ? '=' : 'is null', owner],
      ],
    });

    // update settings
    if (settingsField) {
      try {
        await services.settings.updateSettings(settingsField.id, { value });
      } catch (err) {
        throw new ServerError('SettingsManager. Failed to update settings', { err });
      }
    }

    // create new settings
    if (!settingsField) {
      try {
        await services.settings.createSettings({
          owner: owner || null,
          category,
          name,
          value,
        });
      } catch (err) {
        throw new ServerError('SettingsManager. Failed to create settings', { err });
      }
    }


    const response = await dataloader.settingsPseudos.load(pseudoId);

    return response;
  }

  const resolvers: Resolvers = {
    Mutation: {
      settings: () => ({}),
    },
    SettingsMutation: {},
  };

  categories.forEach((category) => {
    resolvers.SettingsMutation[category.name] = () => ({ category: category.name });
    resolvers[category.type] = {};

    names.filter((n) => n.category === category.name).forEach((nameField) => {
      resolvers[category.type][nameField.name] = mutationResolver;
    });
  });

  return resolvers;
}

export default buildResolver;
