import { SchemaBuilderParams } from '@via-profit-services/settings-manager';

const buildMutations = (params: SchemaBuilderParams['mutation']) => {
  const { names, categories } = params;
  const mutationSchema = `
    extend type Mutation {
      settings: SettingsMutation!
    }

    type SettingsMutation {
      ${categories.map(({ name, type }) => (`
        ${name}: ${type}!
      `))}
    }

    ${categories.map((category) => (`
      type ${category.type} {
        ${names.filter((n) => n.category === category.name).map((name) => (`
          ${name.name}(value: ${name.input}!): ${name.return}!
        `))}
      }    
    `))}
  `;


  return mutationSchema.replace(/,\n/gmi, '');
}

export default buildMutations;
