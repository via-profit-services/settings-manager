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
  group: string;
  category: Category;
  owner?: string;
  name: string;
  value: any;
  comment?: string;
}

export async function seed(knex: Knex): Promise<any> {
  return knex('settings').del()
    .then(() => {
      const owner = uuidv4();
      const settings: SettingsField[] = [
        {
          owner,
          group: 'layout',
          category: Category.ui,
          name: 'theme',
          value: 'dark',
          comment: 'Theme name for specified account',
        },
        {
          owner,
          group: 'layout',
          category: Category.ui,
          name: 'menu',
          value: false,
          comment: 'Display Main Menu for specified account',
        },
        {
          group: 'layout',
          category: Category.ui,
          name: 'theme',
          value: 'light',
          comment: 'Default Theme name for all accounts',
        },
        {
          group: 'layout',
          category: Category.ui,
          name: 'menu',
          value: false,
          comment: 'Default state of Display Main Menu for all accounts',
        },
        {
          group: 'accounts',
          category: Category.constraint,
          name: 'maxSessions',
          value: false,
        },
        {
          group: 'main',
          category: Category.contact,
          name: 'adminEmail',
          value: 'promo@via-profit.ru',
        },
        {
          group: 'main',
          category: Category.label,
          name: 'companyDisplayName',
          value: 'Via Profit',
        },
      ];

      return knex('settings').insert(settings.map((settingsField) => ({
        ...settingsField,
        id: uuidv4(),
        value: JSON.stringify(settingsField.value),
      })));
    });
}
