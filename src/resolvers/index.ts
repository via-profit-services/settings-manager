import { IResolvers } from '@graphql-tools/utils';

import Mutation from './Mutation';
import Query from './Query';
import SettingsCollection from './SettingsCollection';
import SettingsCommonFields from './SettingsCommonFields';
import SettingsCommonGroup from './SettingsCommonGroup';
import SettingsMutation from './SettingsMutation';
import SettingsValue from './SettingsValue';

const resolvers: IResolvers = {
  Mutation,
  Query,
  SettingsCollection,
  SettingsCommonFields,
  SettingsCommonGroup,
  SettingsMutation,
  SettingsValue,
}

export default resolvers;
