/* eslint-disable import/prefer-default-export */
import { IFieldResolver } from 'graphql-tools';
import { Context } from '../../context';
import createLoaders from './loaders';

export enum Category {
  general = 'general',
  ui = 'ui',
  contact = 'contact',
  constraint = 'constraint',
  currency = 'currency',
  size = 'size',
  label = 'label',
  other = 'other'
}

interface MakeSchemaParams {
  /** Group name */
  [key: string]: Array<{
    category: Category;
    name: string | string[];
    owner?: string;
  }>;
}

interface TSource {
  owner?: string;
}

export const makeSchema = (params: MakeSchemaParams) => {
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
      const capitalizeCategory = category.charAt(0).toUpperCase() + category.slice(1);
      const namesOfThisCategory = dataArray.filter((d) => d.category === category);

      typeDefs.push(`
        """
        Type of «${capitalizeGroup}» group for «${capitalizeCategory}» category
        This type was generated automatically
        """
        type Settings${capitalizeGroup}${capitalizeCategory}Fields {
      `);

      namesOfThisCategory.forEach(({ name }) => {
        const names = Array.isArray(name) ? name : [name];
        names.forEach((mname) => {
          typeDefs.push(`
            """
            «${mname}» options of «${capitalizeGroup}» group for «${capitalizeCategory}» category
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
      const capitalizeCategory = category.charAt(0).toUpperCase() + category.slice(1);
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
        ${category}: Settings${capitalizeGroup}${capitalizeCategory}Fields!
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
    resolvers.SettingsCollection[group] = (parent: TSource) => parent;

    // define group
    resolvers[`Settings${capitalizeGroup}Group`] = {};
    categories.forEach((category) => {
      const namesOfThisCategory = dataArray.filter((d) => d.category === category);

      // append category into the group
      resolvers[`Settings${capitalizeGroup}Group`][category] = (parent: TSource) => parent;

      const obj: any = {};
      namesOfThisCategory.forEach(({ name }) => {
        const names = Array.isArray(name) ? name : [name];
        names.forEach((mname) => {
          const resolver: IFieldResolver<TSource, Context> = async (
            parent: TSource, args, context, info) => {
            const { owner } = parent;

            const id = [
              info.path.prev.prev.prev.key, // group
              info.path.prev.prev.key, // category
              info.path.prev.key, // field
              owner,
            ].join('|');

            const loaders = createLoaders(context);
            const settings = await loaders.settings.load(id);

            return settings ? settings.value : null;
          };
          obj[mname] = resolver;
        });
      });
      const capitalizeCategory = category.charAt(0).toUpperCase() + category.slice(1);
      resolvers[`Settings${capitalizeGroup}${capitalizeCategory}Fields`] = obj;
    });
  });
  // console.log('');
  // console.log(typeDefs.join('\n'));
  // console.log(resolvers);
  // console.log('');
  return {
    typeDefs: typeDefs.join('\n'),
    resolvers,
  };
};
