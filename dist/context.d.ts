import { IContext, ILoggerCollection } from '@via-profit-services/core';
import { Logger } from 'winston';
export declare type Context = Pick<IContext, 'knex' | 'timezone' | 'redis' | 'token'> & {
    logger: ILoggerCollection & {
        settings: Logger;
    };
};
