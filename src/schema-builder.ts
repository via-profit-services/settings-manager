/* eslint-disable arrow-body-style */
import { BadRequestError, ServerError } from '@via-profit-services/core';
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
        const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

        const owner = services.settings.ownerResolver(context);
        const pseudoId = services.settings.dataToPseudoId({ category, name, owner });

        // check to valid settings value
        const settingsParam = settingsMap?.[category]?.[name] || false;
        if (!settingsParam) {
          throw new BadRequestError('SettingsManager. Invalid value');
        }

        if ('bool' in settingsParam && typeof value !== 'boolean') {
          throw new BadRequestError(
            `SettingsManager. Invalid value for type Settings${cap(category)}${cap(name)}Boolean. Expected «boolean», but got «${typeof value}»`,
          );
        }

        if ('int' in settingsParam && typeof value !== 'number') {
          throw new BadRequestError(
            `SettingsManager. Invalid value for Settings${cap(category)}${cap(name)}Int. Expected «number», but got «${typeof value}»`,
          );
        }

        if ('string' in settingsParam && typeof value !== 'string') {
          throw new BadRequestError(
            `SettingsManager. Invalid value for Settings${cap(category)}${cap(name)}String. Expected «string», but got «${typeof value}»`,
          );
        }

        if ('enum' in settingsParam && typeof value !== typeof settingsParam.enum[0]) {

          throw new BadRequestError(
            `SettingsManager. Invalid value for Settings${cap(category)}${cap(name)}. Expected «${typeof settingsParam.enum[0]}», but got «${typeof value}»`,
          );
        }

        if ('enum' in settingsParam && !settingsParam.enum.includes(value)) {

          throw new BadRequestError(
            `SettingsManager. Invalid value for Settings${cap(category)}${cap(name)}. Expected one of [${settingsParam.enum.join('; ')}], but got «${value}»`,
          );
        }

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


        const response = await dataloader.settingsPseudos.load(pseudoId);

        return response;
      },
    },
  };

  const categoriesList = Object.keys(settingsMap);
  const namesList = Object.entries(settingsMap).map(([_category, namesMap]) => {
    return Object.keys(namesMap);
  })

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
        category: SettingsCategory!

        """
        Settings field name
        """
        name: SettingsName!

        """
        Settings value
        """
        value: JSON!
      ): SettingsSetResponse!
    }

    type SettingsSetResponse {
      id: ID!
      value: String!
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

    enum SettingsCategory {
      ${categoriesList.join(' ')}
    }

    enum SettingsName {
      ${namesList.join(' ')}
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
