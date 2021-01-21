import { ServerError } from '@via-profit-services/core';
import type { SchemaBuilder, ValuesResolver, Resolvers } from '@via-profit-services/settings-manager';

const schemaBuilder: SchemaBuilder = (settingsMap) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const valueResolver = new Proxy<ValuesResolver>({
    id: () => ({}),
    createdAt: () => ({}),
    updatedAt: () => ({}),
    owner: () => ({}),
    value: () => ({}),
    }, {
      get: (_target, prop: keyof ValuesResolver) => {

        const resolver: ValuesResolver[keyof ValuesResolver] = async (parent) => {
          const { name, category } = parent;

          const se: Record<string, any> = {
            id: '8ac7f540-ec73-40f4-9d9c-bbf42ef85517',
            owner: '3c9ee90d-bba4-423f-aa65-6883bc8abf45',
            createdAt: new Date(),
            updatedAt: new Date(),
            value: '',
          };

          if (name === 'theme' && category === 'ui') {
            se.value = 'standard';
          }

          if (name === 'drawer' && category === 'ui') {
            se.value = true;
          }

          return se[prop];

        }

        return resolver;
      },
  });

  const resolvers: Resolvers = {
    Query: {
      settings: () => ({}),
    },
    Mutation: {
      settings: () => ({}),
    },
    SettingsQuery: {},
    SettingsValueBoolean: valueResolver,
    SettingsValueInt: valueResolver,
    SettingsValueString: valueResolver,
    SettingsMutation: {
      set: async (_parent, args, context) => {
        const { services, dataloader } = context;
        const { name, value, category, id } = args;

        const owner = services.settings.ownerResolver(context);
        const pseudoId = services.settings.dataToPseudoId({ category, name, owner });

        dataloader.settings.clear(pseudoId);

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
              id,
              owner: owner || null,
              category,
              name,
              value,
            });
          } catch (err) {
            throw new ServerError('SettingsManager. Failed to create settings', { err });
          }
        }

      },
    },
  };

  const typeDefs = `

    extend type Query {
      """
      Returns settings
      """
      settings: SettingsQuery!
    }

    extend type Mutation {
      settings: SettingsMutation!
    }

    interface SettingsNode {
      id: ID!

      """
      Creation date of this settings field
      """
      createdAt: DateTime!

      """
      Updated date of this settings field
      """
      updatedAt: DateTime!

      owner: ID
    }

    type SettingsMutation {
      """
      Set single settings field
      """
      set(
        """
        You may provide custom ID of this record
        """
        id: ID
        
        """
        Settings category
        """
        category: String!

        """
        Settings field name
        """
        name: String!

        """
        Settings value
        """
        value: JSON!
      ): Boolean!
    }

    type SettingsValueInt implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: Int!
    }

    type SettingsValueString implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: String!
    }

    type SettingsValueBoolean implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: Boolean!
    }

    type SettingsQuery {
      ${Object.keys(settingsMap).map((category) => {
        resolvers.SettingsQuery[category] = () => ({});

        return (`
          ${category}: Settings${capitalize(category)}!
        `)
      })}
    }

    ${Object.entries(settingsMap).map(([category, namesMap]) => (`

      type Settings${capitalize(category)} {
        ${Object.entries(namesMap).map(([name, params]) => {

          let valueTypeName = '';

          if ('bool' in params) {
            valueTypeName = 'SettingsValueBoolean';
          }

          if ('string' in params) {
            valueTypeName = 'SettingsValueString';
          }

          if ('int' in params) {
            valueTypeName = 'SettingsValueInt';
          }

          if ('enum' in params) {
            valueTypeName = `Settings${capitalize(category)}${capitalize(name)}`;
          }

          resolvers[`Settings${capitalize(category)}`] = {
            ...resolvers[`Settings${capitalize(category)}`],
            [name]: () => ({ name, category }),
          };

          return (`
            ${name}: ${valueTypeName}!
          `)
        })}
      }

      ${Object.entries(namesMap).map(([name, params]) => {

        let valueTypeName = '';
        let valueType = '';

        if ('bool' in params) {
          valueTypeName = 'SettingsValueBoolean';
        }

        if ('string' in params) {
          valueTypeName = 'SettingsValueString';
        }

        if ('int' in params) {
          valueTypeName = 'SettingsValueInt';
        }

        if ('enum' in params) {
          valueTypeName = `Settings${capitalize(category)}${capitalize(name)}Variant`;
          resolvers[`Settings${capitalize(category)}${capitalize(name)}`] = valueResolver;
          valueType = `
            enum ${valueTypeName} {
              ${params.enum.join(' ')}
            }

            type Settings${capitalize(category)}${capitalize(name)} implements SettingsNode {
              id: ID!
              createdAt: DateTime!
              updatedAt: DateTime!
              owner: ID
              value: ${valueTypeName}!
            } 
          `;
        }

        return `
          ${valueType}
          
        `;
      })}

    `))}
  `.replace(/,\n/gmi, '');

  return {
    typeDefs,
    resolvers,
  };
};

export default schemaBuilder;
