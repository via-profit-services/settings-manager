import { IContext, ILoggerCollection, Winston } from '@via-profit-services/core';
export declare enum TSettingsCategory {
    general = "general",
    ui = "ui",
    contact = "contact",
    constraint = "constraint",
    currency = "currency",
    size = "size",
    label = "label",
    other = "other"
}
export interface MakeSchemaParams {
    /** Group name */
    [key: string]: Array<{
        /** Settings category preset */
        category: TSettingsCategory;
        /** Settings field name */
        name: string | string[];
        owner?: string;
    }>;
}
export declare type Context = Pick<IContext, 'knex' | 'timezone' | 'token'> & {
    logger: ILoggerCollection & {
        settings: Winston.Logger;
    };
};
export interface ISettingsNode {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    owner: string;
    group: string;
    name: string;
    value: any;
    category: TSettingsCategory;
}
export declare type ISettingsParsed = Pick<ISettingsNode, 'owner' | 'group' | 'name' | 'category'>;
export declare type TSettingsTable = ISettingsNode;
export declare type TSettingsTableInput = Omit<ISettingsNode, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};
