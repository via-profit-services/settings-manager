/* eslint-disable arrow-body-style */
import type { SettingsMap } from '@via-profit-services/settings-manager';


export const capitalize = (...args: string[]) => {
  return args.reduce((prev, str) => {
    return prev + str.charAt(0).toUpperCase() + str.slice(1)
  }, '')

};

export const getType = (opt: {
  settingsMap: SettingsMap,
  name: string;
  category: string;
}) => {
  const { category, name, settingsMap } = opt;
  const params = settingsMap[category][name];

  switch (true) {
    case 'int' in params:
      return 'Int';

    case 'bool' in params:
      return 'Boolean';

    case 'enum' in params:
      return `Settings${capitalize(category)}${capitalize(name)}Variant`;

    case 'string' in params:
    default:
      return 'String';
  }
}

export const getTypeValueName = (opt: {
  settingsMap: SettingsMap,
  name: string;
  category: string;
}) => {
  const { category, name, settingsMap } = opt;
  const params = settingsMap[category][name];

  switch (true) {
    case 'int' in params:
      return 'SettingsValueInt';

    case 'bool' in params:
      return 'SettingsValueBoolean';

    case 'enum' in params:
      return `Settings${capitalize(category)}${capitalize(name)}Variant`;

    case 'string' in params:
    default:
      return 'SettingsValueString';
  }
};