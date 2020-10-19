/* eslint-disable import/no-extraneous-dependencies */
import { Knex } from '@via-profit-services/core';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    
    drop table if exists "settings";
    
    drop type if exists "settingsCategory";


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

    CREATE TABLE "settings" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "group" varchar(50) NOT NULL,
      "category" "settingsCategory" NOT NULL DEFAULT 'other'::"settingsCategory",
      "owner" uuid NULL,
      "name" varchar(100) NOT NULL,
      "value" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "comment" text NULL,
      CONSTRAINT settings_pk PRIMARY KEY (id),
      CONSTRAINT settings_un UNIQUE ("group", "category", "name", "owner")
    );
    
    comment on column "settings"."group" is 'Usually, the module name is used as the group name';
    comment on column "settings"."category" is 'Just the name of the settings category, for example, for a catalog - items;category;orders';
    comment on column "settings"."comment" is 'Just comment of this settings field for internal usage';
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table if exists "settings";
    drop type if exists "settingsCategory";
  `);
}
