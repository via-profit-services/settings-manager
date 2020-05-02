/* eslint-disable class-methods-use-this */
// import { v4 as uuidv4 } from 'uuid';

import { Context } from '../../context';


interface IProps {
  context: Context;
}

export interface SettingsNode {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  owner: string;
  group: string;
  value: any;
}

type ID = [string, string, string, string | null];

class SettingsService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public async getSettingsByIds(ids: string[]): Promise<SettingsNode[]> {
    return Promise.resolve().then(() => {
      return ids.map((id) => {
        const [group, category, field, owner] = id.split('|') as ID;

        return {
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          owner,
          group,
          category,
          field,
          value: 55555,
        };
      });
    });
  }
}

export default SettingsService;
export { SettingsService };
