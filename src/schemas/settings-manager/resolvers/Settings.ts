import { IResolverObject } from 'graphql-tools';

import { Context } from '../../../context';
import createLoaders from '../loaders';

export const legalEntityResolver: IResolverObject<any, Context> = {

  createdAt: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.createdAt;
  },
  updatedAt: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.updatedAt;
  },
  name: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.name;
  },
  address: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.address;
  },
  ogrn: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.ogrn;
  },
  kpp: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.kpp;
  },
  inn: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.inn;
  },
  rs: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.rs;
  },
  ks: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.ks;
  },
  bic: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.bic;
  },
  bank: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.bank;
  },
  directorNameNominative: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.directorNameNominative;
  },
  directorNameGenitive: async ({ id }, args, context) => {
    const loaders = createLoaders(context);
    const data = await loaders.legalEntities.load(id);
    return data.directorNameGenitive;
  },
};

export default legalEntityResolver;
