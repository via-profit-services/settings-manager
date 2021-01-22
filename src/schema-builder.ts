import type { SchemaBuilder, Resolvers } from '@via-profit-services/settings-manager';

import buildMutation from './builder/buildMutation';
import buildMutationResolver from './builder/buildMutationResolver';
import buildQuery from './builder/buildQuery';
import buildQueryResolver from './builder/buildQueryResolver';
import convert from './builder/converter';

const schemaBuilder: SchemaBuilder = (settingsMap) => {
  const { query, mutation } = convert(settingsMap);

  const typeDefs = `
    ${buildQuery(query)}
    ${buildMutation(mutation)}
  `;

  const resolvers: Resolvers = {
    ...buildQueryResolver(query),
    ...buildMutationResolver(mutation),
  };


  return {
    typeDefs,
    resolvers,
  };
};

export default schemaBuilder;
