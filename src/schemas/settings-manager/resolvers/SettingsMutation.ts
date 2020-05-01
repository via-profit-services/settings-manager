import { ServerError, TWhereAction } from '@via-profit-services/core';
import { IResolverObject } from 'graphql-tools';

import { Context } from '../../../context';
import createLoaders from '../loaders';
import LegalEntityService, { ILegalEntityUpdateInfo, ILegalEntityCreateInfo } from '../service';

export const legalEntityMutationResolver: IResolverObject<any, Context> = {

  update: async (parent, args: {
    id: string;
    input: ILegalEntityUpdateInfo
  }, context) => {
    const { id, input } = args;
    const loaders = createLoaders(context);
    const legalEntityService = new LegalEntityService({ context });


    // check INN unique
    if (input.inn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, input.inn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        loaders.legalEntities.prime(nodes[0].id, nodes[0]);

        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with inn ${input.inn} value`, { id, input },
          );
        }
      }
    }


    // check OGRN unique
    if (input.ogrn) {
      const { nodes } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, input.ogrn],
          ['id', TWhereAction.NEQ, id],
        ],
      });

      if (nodes.length) {
        loaders.legalEntities.prime(nodes[0].id, nodes[0]);

        if (nodes[0].id !== id) {
          throw new ServerError(
            `Legal entity record already exists with ogrn ${input.ogrn} value`, { id, input },
          );
        }
      }
    }


    try {
      await legalEntityService.updateLegalEntity(id, input);
    } catch (err) {
      throw new ServerError('Failed to update legal entity', { err, id, input });
    }

    // clear cache of this legal entity
    loaders.legalEntities.clear(id);
    return { id };
  },
  create: async (parent, args: { input: ILegalEntityCreateInfo }, context) => {
    const { input } = args;
    const legalEntityService = new LegalEntityService({ context });

    // check INN unique
    if (input.inn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['inn', TWhereAction.EQ, input.inn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with inn ${input.inn} value`, { input },
        );
      }
    }


    // check OGRN unique
    if (input.ogrn) {
      const { totalCount } = await legalEntityService.getLegalEntities({
        limit: 1,
        where: [
          ['ogrn', TWhereAction.EQ, input.ogrn],
        ],
      });

      if (totalCount) {
        throw new ServerError(
          `Legal entity record already exists with ogrn ${input.ogrn} value`, { input },
        );
      }
    }

    try {
      const id = await legalEntityService.createLegalEntity(input);

      return { id };
    } catch (err) {
      throw new ServerError('Failed to create legal entity', { err, input });
    }
  },
  delete: async (parent, args: { id: string; }, context) => {
    const { id } = args;
    const legalEntityService = new LegalEntityService({ context });

    try {
      const result = legalEntityService.deleteLegalEntity(id);
      return result;
    } catch (err) {
      throw new ServerError('Failed to delete legal entity', { err, id });
    }
  },

};


export default legalEntityMutationResolver;
