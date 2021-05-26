import { BadRequestError } from '@via-profit-services/core';
import type { ValuesResolver, Resolvers, SchemaBuilderParams } from '@via-profit-services/settings-manager';

const buildResolver = (props: SchemaBuilderParams['query']) => {
  const { categories, names } = props;
  const valueResolver = new Proxy<ValuesResolver>({
    id: () => ({}),
    createdAt: () => ({}),
    updatedAt: () => ({}),
    owner: () => ({}),
    value: () => ({}),
    }, {
      get: (_target, prop: keyof ValuesResolver) => {

        const resolver: ValuesResolver[keyof ValuesResolver] = async (parent, _args, context) => {
          const { name, category } = parent;
          const { services, dataloader } = context;

          const owner = services.settings.ownerResolver(context);
          const pseudoId = services.settings.dataToPseudoId({ owner, name, category });
          const settingsData = await dataloader.settingsPseudos.load(pseudoId);

          if (typeof settingsData === 'undefined') {
            throw new BadRequestError('SettingsManager. Settings of this params not exists', { parent });
          }

          if (typeof settingsData[prop] === 'undefined') {
            return null;
          }

          return settingsData[prop];
        }

        return resolver;
      },
  });

  const resolvers: Resolvers = {
    Query: {
      settings: () => ({}),
    },
    SettingsBoolean: valueResolver,
    SettingsInt: valueResolver,
    SettingsString: valueResolver,
    SettingsQuery: {},
  };

  categories.forEach((category) => {
    resolvers.SettingsQuery[category.name] = () => ({ category: category.name });
    resolvers[category.type] = {};

    names.filter((n) => n.category === category.name).forEach((nameField) => {
      resolvers[category.type][nameField.name] = () => (nameField);
      resolvers[nameField.type] = valueResolver;
    });
  });

  return resolvers;
}

export default buildResolver;
