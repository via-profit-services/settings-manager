import { SchemaBuilderParams } from '@via-profit-services/settings-manager';
// import path from 'path';
// import fs from 'fs';

const buildQuery = (params: SchemaBuilderParams['query']) => {
  const { enums, names, categories } = params;
  const commonSchema = /* GraphQL */ `
    type SettingsInt implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: Int!
    }

    type SettingsString implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: String!
    }

    type SettingsBoolean implements SettingsNode {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      owner: ID
      value: Boolean!
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
  `;

  const settingsNames = new Map<string, SchemaBuilderParams['query']['names'][0]>();
  names.forEach(data => {
    settingsNames.set(data.name, data);
  });

  const querySchema = `
    extend type Query {
      settings: SettingsQuery!
    }

    enum SettingsCategory {
      ${categories.map(({ name }) => name).join('\n')}
    }

    enum SettingsName {
      ${Array.from(settingsNames.values())
        .map(({ name }) => name)
        .join('\n')}
    }

    type SettingsQuery {
      ${categories.map(
        ({ name, type }) => `
        ${name}: ${type}!
      `,
      )}
    }

    ${enums.map(
      ({ type, variants }) => `
      enum ${type} {
        ${variants.join('\n')}
      }
    `,
    )}

    ${categories.map(
      category => `
      type ${category.type} {
        ${names
          .filter(n => n.category === category.name)
          .map(
            name => `
          ${name.name}: ${name.type}!
        `,
          )}
      }      
    `,
    )}

    ${names
      .filter(({ value }) => typeof value !== 'undefined')
      .map(
        ({ type, value }) => `
      type ${type} implements SettingsNode {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        owner: ID
        value: ${value}!
      }
    `,
      )}
  `;

  const result = `${commonSchema} ${querySchema}`.replace(/,\n/gim, '');

  // fs.writeFileSync(path.resolve(__dirname, 'test.graphql'), result, {
  //   encoding: 'utf8',
  // });

  return result;
};

export default buildQuery;
