import {
  Node, DataLoader, collateForDataloader,
} from '@via-profit-services/core';
import { Context } from '../../context';
import LegalEntityService, { ILegalEntity } from './service';


interface Loaders {
  legalEntities: DataLoader<string, Node<ILegalEntity>>;
}

const loaders: Loaders = {
  legalEntities: null,
};


export default function createLoaders(context: Context) {
  if (loaders.legalEntities !== null) {
    return loaders;
  }

  const service = new LegalEntityService({ context });

  // eslint-disable-next-line arrow-body-style
  loaders.legalEntities = new DataLoader<string, Node<ILegalEntity>>((ids: string[]) => {
    return service.getLegalEntitiesByIds(ids)
      .then((nodes) => collateForDataloader(ids, nodes));
  });

  return loaders;
}
