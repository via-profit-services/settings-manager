import { IContext } from '@via-profit-services/core';

export type Context = Pick<IContext, 'knex' | 'timezone'>
