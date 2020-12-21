import { IResolvers } from '@graphql-tools/utils';

import Mutation from './Mutation';
import Query from './Query';
import SettingsMutation from './SettingsMutation';
import SettingsValue from './SettingsValue';

const resolvers: IResolvers = {
  Mutation,
  Query,
  SettingsMutation,
  SettingsValue,
}

export default resolvers;
