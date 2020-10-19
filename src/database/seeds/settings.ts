/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { Knex } from '@via-profit-services/core';
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
      const settings: SettingsField[] = [
        {
          group: 'layout',
          category: Category.ui,
          name: 'theme',
          value: 'light',
          comment: 'Theme name for specified account',
        },
        {
          group: 'layout',
          category: Category.ui,
          name: 'menu',
          value: true,
          comment: 'Display Main Menu for specified account',
        },
        {
          group: 'layout',
          category: Category.ui,
          name: 'fontSize',
          value: 12,
          comment: 'Interface font size',
        },
      ];

      return knex('settings').insert(settings.map((settingsField) => ({
        ...settingsField,
        id: uuidv4(),
        value: JSON.stringify(settingsField.value),
      })));
    });
}
