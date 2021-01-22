import type { SettingsMap, SchemaBuilderParams, SettingsMapParams } from '@via-profit-services/settings-manager';

const capitalize = (...args: string[]) => args
  .reduce((prev, str) => prev + str.charAt(0).toUpperCase() + str.slice(1), '');

const getBasicTypeName = (params: SettingsMapParams) => {
    switch (true) {
    case 'int' in params:
      return 'SettingsInt';

    case 'bool' in params:
      return 'SettingsBoolean';

    case 'string' in params:
    default:
      return 'SettingsString';
  }
}
const getBasicInputName = (params: SettingsMapParams) => {
  switch (true) {
    case 'int' in params:
      return 'Int';

    case 'bool' in params:
      return 'Boolean';

    case 'string' in params:
    default:
      return 'String';
  }
}

const converter = (settingsMap: SettingsMap): SchemaBuilderParams => {

  const schema: SchemaBuilderParams = {
    query: {
      categories: [],
      enums: [],
      names: [],
    },
    mutation: {
      categories: [],
      names: [],
    },
  };

  Object.entries(settingsMap).forEach(([category, namesMap]) => {
    schema.query.categories.push({
      name: category,
      type: `Settings${capitalize(category)}Query`,
    });

    schema.mutation.categories.push({
      name: category,
      type: `Settings${capitalize(category)}Mutation`,
    });


    Object.entries(namesMap).forEach(([name, params]) => {
      // const typeName = `Settings${capitalize(category)}${capitalize(name)}`;

      if ('enum' in params && params.enum.length) {
        const typeName = `Settings${capitalize(category)}${capitalize(name)}`;
        schema.query.enums.push({
          type: `${typeName}Variant`, // SettingsCategoryNameVariant
          variants: params.enum,
        })

        schema.query.names.push({
          name,
          category,
          type: typeName, // SettingsCategoryName
          value: `${typeName}Variant`, //SettingsCategoryNameVariant
        });

        schema.mutation.names.push({
          name,
          category,
          type: `${typeName}Mutation`, // SettingsCategoryNameMutation
          input: `${typeName}Variant`, // SettingsCategoryNameVariant
          return: typeName,
        });

        return;
      }

      const typeName = getBasicTypeName(params);
      schema.query.names.push({
        name,
        category,
        type: typeName,
      });

      schema.mutation.names.push({
        name,
        category,
        type: typeName,
        input: getBasicInputName(params),
        return: typeName,
      });
    });
  });


  return schema;
}

export default converter;
