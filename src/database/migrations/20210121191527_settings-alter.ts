import * as Knex from 'knex';


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    truncate table "settings" cascade;
    alter table "settings" drop constraint "settings_un";
    alter table "settings" alter column "category" type varchar(100) using "category"::text;
    alter table "settings" alter column "category" drop default;
    drop type "settingsCategory" cascade;
    alter table "settings" drop column "group" cascade;
    alter table "settings" add constraint "settings_un" unique ("category", "name", "owner");
  `);
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw(`
    alter table "settings" drop constraint "settings_un";
    alter table "settings" add column "group" varchar(50) NULL;
    comment on column "settings"."group" is 'Usually, the module name is used as the group name';
    create type "settingsCategory" as  enum (
      'general',
      'ui',
      'contact',
      'currency',
      'constraint',
      'size',
      'label',
      'other'
    );
    alter table "settings" alter column "category" type "settingsCategory" using "category"::"settingsCategory";
    
    update "settings" set "group" = 'ui';
    alter table "settings" alter column "group" set not null;
    
    alter table "settings" add constraint "settings_un" unique ("group", "category", "name", "owner");
  `);
}

