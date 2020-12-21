import { Context } from '@via-profit-services/core';
import type { MakeSchemaParams } from '@via-profit-services/settings-manager';
import '@via-profit-services/accounts';

interface Source {
  owner?: string;
}

const schemaBuilder = (params: MakeSchemaParams) => {
  const typeDefs: string[] = [];
  const resolvers: any = {};

  Object.entries(params).forEach(([group, dataArray]) => {
    const capitalizeGroup = group.charAt(0).toUpperCase() + group.slice(1);
    const categories: string[] = [];


    // get all categories
    dataArray.forEach(({ category }) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });


    // define fields
    categories.forEach((category) => {
      const capitalizeTSettingsCategory = category.charAt(0).toUpperCase() + category.slice(1);
      const namesOfThisTSettingsCategory = dataArray.filter((d) => d.category === category);

      typeDefs.push(`
        """
        Type of «${capitalizeGroup}» group for «${capitalizeTSettingsCategory}» category
        This type was generated automatically
        """
        type Settings${capitalizeGroup}${capitalizeTSettingsCategory}Fields {
      `);

      namesOfThisTSettingsCategory.forEach(({ name }) => {
        const names = Array.isArray(name) ? name : [name];
        names.forEach((mname) => {
          typeDefs.push(`
            """
            «${mname}» options of «${capitalizeGroup}» group for «${capitalizeTSettingsCategory}» category
            This type was generated automatically
            """
            ${mname}: SettingsValue!
          `);
        });
      });

      typeDefs.push(`
        }
      `);
    });


    // extend SettingsCollection
    typeDefs.push(`
      extend type SettingsCollection {
        ${group}: Settings${capitalizeGroup}Group!
      }
    `);

    categories.forEach((category, index) => {
      const capitalizeTSettingsCategory = category.charAt(0).toUpperCase() + category.slice(1);
      if (index === 0) {
        // define group
        typeDefs.push(`
          """
          «${capitalizeGroup}» settings group
          Note: this type was generated automatically
          """
          type Settings${capitalizeGroup}Group {
        `);
      }

      typeDefs.push(`
        ${category}: Settings${capitalizeGroup}${capitalizeTSettingsCategory}Fields!
      `);


      // close group section
      if (index === categories.length - 1) {
        typeDefs.push(`
        }`);
      }
    });
  });


  // generate resolvers object
  Object.entries(params).forEach(([group, dataArray]) => {
    const capitalizeGroup = group.charAt(0).toUpperCase() + group.slice(1);
    const categories: string[] = [];

    dataArray.forEach(({ category }) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });


    // define settings collection
    resolvers.SettingsCollection = resolvers.SettingsCollection || {};
    resolvers.SettingsCollection[group] = (parent: Source) => ({
        ...parent,
        group,
      });

    // define group
    resolvers[`Settings${capitalizeGroup}Group`] = {};
    categories.forEach((category) => {
      const namesOfThisTSettingsCategory = dataArray.filter((d) => d.category === category);

      // append category into the group
      resolvers[`Settings${capitalizeGroup}Group`][category] = async (parent: Source) => ({
          ...parent,
          category,
        });

      const obj: any = {};
      namesOfThisTSettingsCategory.forEach(({ name }) => {
        const names = Array.isArray(name) ? name : [name];
        names.forEach((mname) => {
          obj[mname] = async (parent: any, args: any, context: Context) => {
            const { owner } = parent;
            const { token } = context;

            return {
              ...parent,
              owner: owner || token.uuid,
              name: mname,
            };
          };
        });
      });

      const capitalizeTSettingsCategory = category.charAt(0).toUpperCase() + category.slice(1);
      resolvers[`Settings${capitalizeGroup}${capitalizeTSettingsCategory}Fields`] = obj;
    });
  });

  return {
    typeDefs: typeDefs.join('\n'),
    resolvers,
  };
};

export default schemaBuilder;
