import { OutputFilter } from '@via-profit-services/core';
import { convertWhereToKnex, convertOrderByToKnex, convertJsonToKnex, convertSearchToKnex } from '@via-profit-services/knex';
import type { SettingsNode, SettingsParsed, SettingsCategory, SettingsServiceProps } from '@via-profit-services/settings-manager';
import moment from 'moment-timezone';


interface SettingsTableModel {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly id: string;
  readonly owner: string;
  readonly group: string;
  readonly name: string;
  readonly value: any | null;
  readonly category: SettingsCategory;
  readonly comment: string;
}

interface SettingsTableModelResult {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly id: string;
  readonly owner: string;
  readonly group: string;
  readonly name: string;
  readonly value: any | null;
  readonly category: SettingsCategory;
  readonly comment: string;
}


class SettingsService {
  public props: SettingsServiceProps;

  public constructor(props: SettingsServiceProps) {
    this.props = props;
  }

  public async getSettings(filter: Partial<OutputFilter>): Promise<SettingsNode[]> {
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
      .from<SettingsTableModel, SettingsTableModelResult[]>('settings')
      .limit(limit || 1)
      .offset(offset || 0)
      .where((builder) => convertWhereToKnex(builder, where))
      .where((builder) => convertSearchToKnex(builder, search))
      .orderBy(convertOrderByToKnex(orderBy));

    return settingsList;
  }

  public async getSettingsByIds(ids: string[]): Promise<SettingsNode[]> {
    const nodes = await this.getSettings({
      where: [['id', 'in', ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public dataToPseudoId(data: SettingsParsed) {
    const {
      group, category, name, owner,
    } = data;

    return [ group, category, name, owner ].join('|');
  }

  public getDataFromPseudoId(pseudoId: string): SettingsParsed {
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
    } as SettingsParsed;
  }

  public async getSettingsByPseudoIds(pseudoIds: string[]): Promise<SettingsNode[]> {
    const { knex } = this.props.context;
    const settingsList = await knex
      .select(['*'])
      .from<SettingsTableModel, SettingsTableModelResult[]>('settings')
      .limit(1000)
      .where((builder) => {
        pseudoIds.forEach((pseudoId) => {
          const data = this.getDataFromPseudoId(pseudoId);
          builder.orWhere((orBuilder) => {
            orBuilder.where('category', '=', data.category);
            orBuilder.where('group', '=', data.group);
            orBuilder.where('name', '=', data.name);

            orBuilder.andWhere((andBuilder) => {
              if (data.owner) {
                andBuilder.where('owner', '=', data.owner).orWhereNull('owner');
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


  public async updateSettings(id: string, settingsField: Partial<SettingsNode>): Promise<string> {
    const {
      knex, timezone,
    } = this.props.context;

    const data = {
      ...settingsField,
      id,
      value: JSON.stringify(settingsField.value),
      updatedAt: moment.tz(timezone).format(),
    };
    const [affectedId]: string[] = await knex<Partial<SettingsTableModel>>('settings')
      .update(data)
      .where('id', id)
      .returning('id');

    return affectedId;
  }

  public async createSettings(settingsField: Omit<SettingsNode, 'createdAt' | 'updatedAt'>): Promise<string> {
    const {
      knex, timezone,
    } = this.props.context;


    const data = {
      ...settingsField,
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
      value: JSON.stringify(settingsField.value),
    };

    const [affectedId]: string[] = await knex<Partial<SettingsTableModel>>('settings')
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
