/* eslint-disable class-methods-use-this */
// import { v4 as uuidv4 } from 'uuid';
import {
  TOutputFilter, TWhereAction, convertWhereToKnex, convertOrderByToKnex, convertJsonToKnex,
} from '@via-profit-services/core';

import moment from 'moment-timezone';

import { Context } from '../../context';
import { TSettingsCategory } from './types';

export const REDIS_HASHNAME = 'viaprofitservices';
export const REDIS_FIELDNAME = 'settings';


interface IProps {
  context: Context;
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

type TSettingsTable = ISettingsNode;
type TSettingsTableInput = Omit<ISettingsNode, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};


class SettingsService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public async getSettings(filter: Partial<TOutputFilter>): Promise<ISettingsNode[]> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit,
      offset,
      orderBy,
      where,
      search,
    } = filter;


    if (search) {
      where.push([search.field, TWhereAction.ILIKE, `%${search.query}%`]);
    }

    const settingsList = await knex
      .select([
        '*',
      ])
      .from<any, TSettingsTable[]>('settings')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .orderBy(convertOrderByToKnex(orderBy));

    return settingsList;
  }

  public async getSettingsByIds(ids: string[]): Promise<ISettingsNode[]> {
    const nodes = await this.getSettings({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }


  public async updateSettings(id: string, settingsField: Partial<ISettingsNode>): Promise<string> {
    const {
      knex, timezone,
    } = this.props.context;

    const data = {
      ...settingsField,
      id,
      value: convertJsonToKnex(knex, settingsField.value),
      updatedAt: moment.tz(timezone).format(),
    };
    const [affectedId]: string[] = await knex<Partial<TSettingsTableInput>>('settings')
      .update(data)
      .where('id', id)
      .returning('id');

    return affectedId;
  }

  public async createSettings(settingsField: Omit<ISettingsNode, 'createdAt' | 'updatedAt'>): Promise<string> {
    const {
      knex, timezone,
    } = this.props.context;

    const data = {
      ...settingsField,
      value: convertJsonToKnex(knex, settingsField.value),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
    };
    const [affectedId]: string[] = await knex<Partial<TSettingsTableInput>>('settings')
      .insert(data)
      .returning('id');

    return affectedId;
  }


  public async deleteSettings(id: string): Promise<string> {
    const { knex } = this.props.context;

    const [deletedId]: string[] = await knex('settings')
      .del()
      .where({ id })
      .returning('id');

    return deletedId;
  }
}

export default SettingsService;
export { SettingsService };
