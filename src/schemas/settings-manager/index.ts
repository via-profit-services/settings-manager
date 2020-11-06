import resolvers from './resolvers';
import * as typeDefs from './schema.graphql';
import service from './service';
import makeSchema from './makeSchema';

export * from './logger';
export * from './types';

const Settings = service;

export {
  service,
  Settings,
  typeDefs,
  resolvers,
  makeSchema,
};
