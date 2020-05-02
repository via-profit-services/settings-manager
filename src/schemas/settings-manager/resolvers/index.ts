import { IResolvers } from 'graphql-tools';

import { Context } from '../../../context';

const resolvers: IResolvers<any, Context> = {
  Query: {
    settings: (parent, args) => (args),
  },
  SettingsCollection: {
    common: () => ({}),
  },
  SettingsCommonGroup: {
    contact: () => ({}),
  },
  SettingsCommonFields: {
    developer: () => 'Via Profit',
  },
};

interface TSource {
  owner?: string;
}

export default resolvers;
