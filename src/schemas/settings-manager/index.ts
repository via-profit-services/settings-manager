import permissions from './permissions';
import resolvers from './resolvers';
import * as typeDefs from './schema.graphql';
import service from './service';

export * from './makeSchema';

export {
  service,
  typeDefs,
  resolvers,
  permissions,
};
