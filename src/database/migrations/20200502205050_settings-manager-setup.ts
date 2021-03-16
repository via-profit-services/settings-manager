import type Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.raw(`
    
    drop table if exists "settings" cascade;
    
    create table "settings" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "category" varchar(100) NOT NULL,
      "owner" uuid NULL,
      "name" varchar(100) NOT NULL,
      "value" jsonb NOT NULL DEFAULT '{}'::jsonb,
      "comment" text NULL,
      CONSTRAINT settings_pk PRIMARY KEY ("id"),
      CONSTRAINT settings_un UNIQUE ("category", "name", "owner")
    );
  `);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    drop table if exists "settings" cascade;
  `);
}
