/* eslint-disable arrow-body-style */
import { BadRequestError, ServerError } from '@via-profit-services/core';
import type { SchemaBuilder, ValuesResolver, Resolvers, MutationResolverFactory } from '@via-profit-services/settings-manager';

import { capitalize, getTypeValueName, getType } from './utils/helpers';

const schemaBuilder: SchemaBuilder = (settingsMap) => {

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

  const getMutationResolver: MutationResolverFactory = (params) => async (_p, args, context) => {
    const { services, dataloader } = context;
    const { name, category } = params;
    const { value } = args;
    const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const owner = services.settings.ownerResolver(context);
    const pseudoId = services.settings.dataToPseudoId({ category, name, owner });
    const valueTypeName = getTypeValueName({ settingsMap, category, name });

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

    if ('enum' in settingsParam && !settingsParam.enum.includes(String(value))) {

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

    return {
      __typename: valueTypeName,
      ...response,
    };
  }

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
    SettingsMutation: {},
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
          ${category}: Settings${capitalize(category)}Query!
        `)
      })}
    }
    type SettingsMutation {
      ${Object.keys(settingsMap).map((category) => {
        resolvers.SettingsMutation[category] = () => ({ category });

        return (`
          ${category}: Settings${capitalize(category)}Mutation!
        `)
      })}
    }



    ${Object.entries(settingsMap).map(([category, namesMap]) => (`

      """${capitalize(category)} query collection"""
      type Settings${capitalize(category)}Query {
        ${Object.entries(namesMap).map(([name]) => {

          resolvers[`Settings${capitalize(category)}Query`] = {
            ...resolvers[`Settings${capitalize(category)}Query`],
            [name]: () => ({ name, category }),
          };

          return (`
            """${capitalize(category)} ${name} settings"""
            ${name}: Settings${capitalize(category, name)}!
          `)
        })}
      }



      type Settings${capitalize(category)}Mutation {
        ${Object.entries(namesMap).map(([name]) => {

          const inputType = getType({ settingsMap, category, name });

          resolvers[`Settings${capitalize(category)}Mutation`] = {
            ...resolvers[`Settings${capitalize(category)}Mutation`],
            [name]: getMutationResolver({ name, category }),
          };

          return (`
            ${name}(
              value: ${inputType}
            ): Settings${capitalize(category, name)}!
          `)
        })}
      }

      ${Object.entries(namesMap).map(([name, params]) => {

        const valueTypeName = getTypeValueName({ settingsMap, category, name });

        if ('enum' in params) {
          resolvers[`Settings${capitalize(category, name)}`] = valueResolver;
        }


        return `
          type Settings${capitalize(category, name)} implements SettingsNode {
            id: ID!
            createdAt: DateTime!
            updatedAt: DateTime!
            owner: ID
            value: ${valueTypeName}!
          } 

          ${('enum' in params) ? (`
            enum ${valueTypeName} {
              ${params.enum.join(' ')}
            }
          `) : ''}
          
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
