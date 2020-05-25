import { IContext, ILoggerCollection } from '@via-profit-services/core';
import { Logger } from 'winston';

export enum TSettingsCategory {
  general = 'general',
  ui = 'ui',
  contact = 'contact',
  constraint = 'constraint',
  currency = 'currency',
  size = 'size',
  label = 'label',
  other = 'other'
}


export interface MakeSchemaParams {
  /** Group name */
  [key: string]: Array<{

    /** Settings category preset */
    category: TSettingsCategory;

    /** Settings field name */
    name: string | string[];

    owner?: string;
  }>;
}


export type Context = Pick<IContext, 'knex' | 'timezone' | 'token'> & {
  logger: ILoggerCollection & {
    settings: Logger;
  };
}


export interface ISettingsNode {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  owner: string;
  group: string;
  name: string;
  value: any;
  category: TSettingsCategory;
}

export type ISettingsParsed = Pick<ISettingsNode, 'owner' | 'group' | 'name' | 'category'>;

export type TSettingsTable = ISettingsNode;
export type TSettingsTableInput = Omit<ISettingsNode, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
