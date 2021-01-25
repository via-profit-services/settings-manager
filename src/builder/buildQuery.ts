import { SchemaBuilderParams } from '@via-profit-services/settings-manager';

const buildQuery = (params: SchemaBuilderParams['query']) => {
  const { enums, names, categories } = params;
  const commonSchema = /* GraphQL */`

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

  const querySchema = `
    extend type Query {
      settings: SettingsQuery!
    }

    enum SettingsCategory {
      ${categories.map(({ name }) => name).join(' ')}
    }

    enum SettingsName {
      ${names.map(({ name }) => name).join(' ')}
    }

    type SettingsQuery {
      ${categories.map(({ name, type }) => (`
        ${name}: ${type}!
      `))}
    }

    ${enums.map(({ type, variants }) => (`
      enum ${type} {
        ${variants.join(' ')}
      }
    `))}

    ${categories.map((category) => (`
      type ${category.type} {
        ${names.filter((n) => n.category === category.name).map((name) => (`
          ${name.name}: ${name.type}!
        `))}
      }      
    `))}

    ${names.filter(({ value }) => typeof value !== 'undefined').map(({ type, value }) => (`
      type ${type} implements SettingsNode {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        owner: ID
        value: ${value}!
      }
    `))}
  `;


  return `${commonSchema} ${querySchema}`.replace(/,\n/gmi, '');
}

export default buildQuery;
