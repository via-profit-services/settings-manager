import { IResolvers } from 'graphql-tools';
import { Context } from '../../../context';

import LegalEntitiesMutationResolver from './LegalEntitiesMutation';
import LegalEntitiesQueryResolver from './LegalEntitiesQuery';
import LegalEntityResolver from './LegalEntity';

const resolvers: IResolvers<any, Context> = {
  Query: {
    legalEntities: () => ({}),
  },
  Mutation: {
    legalEntities: () => ({}),
  },
  LegalEntity: LegalEntityResolver,
  LegalEntitiesQuery: LegalEntitiesQueryResolver,
  LegalEntitiesMutation: LegalEntitiesMutationResolver,
};

export default resolvers;
