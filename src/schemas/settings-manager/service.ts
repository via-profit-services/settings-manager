import {
  TOutputFilter, TWhereAction, convertWhereToKnex, convertOrderByToKnex, convertJsonToKnex,
} from '@via-profit-services/core';

import moment from 'moment-timezone';

import {
  ISettingsNode,
  ISettingsParsed,
  TSettingsTable,
  TSettingsTableInput,
  Context,
} from './types';

interface IProps {
  context: Context;
}


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


    const settingsList = await knex
      .select(['*'])
      .from<any, TSettingsTable[]>('settings')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => {
        // This is a temporary solution until the «Search» module is implemented
        if (search) {
          search.forEach(({ field, query }) => {
            query.split(' ').map((subquery) => {
              // Note: Set type ::text forcibly
              return builder.orWhereRaw(`"${field}"::text ${TWhereAction.ILIKE} '%${subquery}%'`);
            });
          });
        }
        return builder;
      })
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

  public static DataToPseudoId(data: ISettingsParsed) {
    const {
      group, category, name, owner,
    } = data;
    return [
      group,
      category,
      name,
      owner,
    ].join('|');
  }

  public static getDataFromPseudoId(pseudoId: string): ISettingsParsed {
    const [
      group,
      category,
      name,
      owner,
    ] = pseudoId.split('|') as string[];

    return {
      group,
      category,
      name,
      owner,
    } as ISettingsParsed;
  }

  public async getSettingsByPseudoId(pseudoId: string): Promise<ISettingsNode | false> {
    const settings = await this.getSettingsByPseudoIds([pseudoId]);
    return settings.length ? settings[0] : false;
  }

  public async getSettingsByPseudoIds(pseudoIds: string[]): Promise<ISettingsNode[]> {
    const { knex } = this.props.context;
    const settingsList = await knex
      .select(['*'])
      .from<any, TSettingsTable[]>('settings')
      .limit(1000)
      .where((builder) => {
        pseudoIds.forEach((pseudoId) => {
          const data = SettingsService.getDataFromPseudoId(pseudoId);
          builder.orWhere((orBuilder) => {
            orBuilder.where('category', TWhereAction.EQ, data.category);
            orBuilder.where('group', TWhereAction.EQ, data.group);
            orBuilder.where('name', TWhereAction.EQ, data.name);

            orBuilder.andWhere((andBuilder) => {
              if (data.owner) {
                andBuilder.where('owner', TWhereAction.EQ, data.owner).orWhereNull('owner');
              } else {
                andBuilder.whereNull('owner');
              }
            });
          });
        });

        return builder;
      });

    return settingsList;
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
