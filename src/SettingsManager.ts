import { BadRequestError, OutputFilter } from '@via-profit-services/core';
import { convertWhereToKnex, convertOrderByToKnex, convertSearchToKnex } from '@via-profit-services/knex';
import type {
  SettingsNode, SettingsParsed, SettingsServiceProps, SettingsTableModel,
  SettingsTableModelResult, OwnerResolverFunc, SettingsMap,
 } from '@via-profit-services/settings-manager';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';


class SettingsService {
  public props: SettingsServiceProps;
  public ownerResolver: OwnerResolverFunc;

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
    const { category, name, owner } = data;

    return [ category, name, owner ].join('|');
  }

  public getDataFromPseudoId(pseudoId: string): SettingsParsed {
    const [
      category,
      name,
      owner,
    ] = pseudoId.split('|') as string[];

    return {
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

  public async updateSettings(id: string, input: Partial<SettingsNode>): Promise<string> {
    const { knex, timezone } = this.props.context;

    const data: Partial<SettingsTableModel> = {
      ...input,
      id,
      value: JSON.stringify(input.value),
      createdAt: input.createdAt ? moment.tz(input.createdAt, timezone).format() : undefined,
      updatedAt: moment.tz(timezone).format(),
    };
    const [affectedId]: string[] = await knex<Partial<SettingsTableModel>>('settings')
      .update(data)
      .where('id', id)
      .returning('id');

    return affectedId;
  }

  public async createSettings(input: Partial<SettingsNode>): Promise<string> {
    const { knex, timezone } = this.props.context;


    const data: SettingsTableModel = {
      ...input,
      id: input.id ? input.id : uuidv4(),
      createdAt: moment.tz(timezone).format(),
      updatedAt: moment.tz(timezone).format(),
      value: JSON.stringify(input.value),
      owner: input.owner ? input.owner : null,
      category: input.category ? input.category : '',
      name: input.name ? input.name : '',
      comment: typeof input.comment !== 'undefined' ? input.comment : null,
    };

    const [affectedId]: string[] = await knex<SettingsTableModel>('settings')
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

  public async resolveSettingsByPsudoIDs(pseudoIds: string[]): Promise<SettingsNode[]> {

    // const result: SettingsNode[] = [];

    // try to load settings
    const nodes = await this.getSettingsByPseudoIds(pseudoIds);

    const result = pseudoIds.map((pseudoID) => {
      const { category, name, owner } = this.getDataFromPseudoId(pseudoID);
      const settingsList = nodes.filter((node) => node.category === category && node.name === name);
      const settings = settingsList.find((s) => s.owner === (owner || null));
      // result.push();
      if (settings) {
        return settings;
      }

      const newSettings: SettingsNode = {
        category,
        value: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...settingsList[0],
        owner: owner || '',
        comment: '',
        id: uuidv4(),
      };

      if (!newSettings.category) {
        throw new BadRequestError('SettingsManager. Invalid settings. Check the', { newSettings });
      }

      if (!owner) {
        throw new BadRequestError('SettingsManager. Check the global settings exist. Maybe you should to execute migrations for this', newSettings);
      }

      try {
        this.createSettings(newSettings);
      } catch (err) {
        throw new BadRequestError('Failed to create new settings record', { err });
      }

      return newSettings;
    })


    return result;
  }

  public async writeDefaultSettings(settingsMap: SettingsMap): Promise<void> {
    const { context } = this.props;
    const { knex, timezone } = context;

    const settingsDefaultList: SettingsTableModel[] = [];

    Object.entries(settingsMap).forEach(([category, namesMap]) => {
      Object.entries(namesMap).forEach(([name, { defaultValue }]) => {
        settingsDefaultList.push({
          id: uuidv4(),
          createdAt: moment.tz(timezone).format(),
          updatedAt: moment.tz(timezone).format(),
          owner: null,
          category,
          name,
          value: JSON.stringify(defaultValue),
          comment: '',
        });
      });
    });


    await knex.raw(`
      ${knex('settings').insert(settingsDefaultList).toQuery()}
      on conflict on constraint "settings_un" do update set
      "value" = excluded."value",
      "id" = excluded."id";
    `);
  }
}

export default SettingsService;
