/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import * as Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';

enum Category {
  general = 'general',
  ui = 'ui',
  contact = 'contact',
  constraint = 'constraint',
  currency = 'currency',
  size = 'size',
  label = 'label',
  other = 'other'
}

interface SettingsField {
  id: string;
  group: string;
  category: Category;
  owner?: string;
  name: string;
  value: Object;
}

export async function seed(knex: Knex): Promise<any> {
  return knex('settings').del()
    .then(() => {
      const owner = uuidv4();
      const settings: SettingsField[] = [
        {
          id: uuidv4(),
          owner,
          group: 'accounts',
          category: Category.ui,
          name: 'theme',
          value: 'dark',
        },
        {
          id: uuidv4(),
          owner,
          group: 'accounts',
          category: Category.ui,
          name: 'menu',
          value: false,
        },
        {
          id: uuidv4(),
          group: 'accounts',
          category: Category.constraint,
          name: 'maxSessions',
          value: false,
        },
        {
          id: uuidv4(),
          group: 'main',
          category: Category.contact,
          name: 'adminEmail',
          value: 'promo@via-profit.ru',
        },
        {
          id: uuidv4(),
          group: 'main',
          category: Category.label,
          name: 'companyDisplayName',
          value: 'Via Profit',
        },
      ];

      return knex('settings').insert(settings);
    });
}
