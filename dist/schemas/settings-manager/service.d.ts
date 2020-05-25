import { TOutputFilter } from '@via-profit-services/core';
import { ISettingsNode, ISettingsParsed, Context } from './types';
interface IProps {
    context: Context;
}
declare class SettingsService {
    props: IProps;
    constructor(props: IProps);
    getSettings(filter: Partial<TOutputFilter>): Promise<ISettingsNode[]>;
    getSettingsByIds(ids: string[]): Promise<ISettingsNode[]>;
    static DataToPseudoId(data: ISettingsParsed): string;
    static getDataFromPseudoId(pseudoId: string): ISettingsParsed;
    getSettingsByPseudoIds(pseudoIds: string[]): Promise<ISettingsNode[]>;
    updateSettings(id: string, settingsField: Partial<ISettingsNode>): Promise<string>;
    createSettings(settingsField: Omit<ISettingsNode, 'createdAt' | 'updatedAt'>): Promise<string>;
    deleteSettings(id: string): Promise<string>;
}
export default SettingsService;
export { SettingsService };
