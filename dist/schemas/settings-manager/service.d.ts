import { TOutputFilter } from '@via-profit-services/core';
import { Context } from '../../context';
import { TSettingsCategory } from './types';
export declare const REDIS_HASHNAME = "viaprofitservices";
export declare const REDIS_FIELDNAME = "settings";
interface IProps {
    context: Context;
}
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
declare class SettingsService {
    props: IProps;
    constructor(props: IProps);
    getSettings(filter: Partial<TOutputFilter>): Promise<ISettingsNode[]>;
    getSettingsByIds(ids: string[]): Promise<ISettingsNode[]>;
    updateSettings(id: string, settingsField: Partial<ISettingsNode>): Promise<string>;
    createSettings(settingsField: Omit<ISettingsNode, 'createdAt' | 'updatedAt'>): Promise<string>;
    deleteSettings(id: string): Promise<string>;
}
export default SettingsService;
export { SettingsService };
