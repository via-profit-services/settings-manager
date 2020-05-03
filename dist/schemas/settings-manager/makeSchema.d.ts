import { TSettingsCategory } from './types';
interface MakeSchemaParams {
    /** Group name */
    [key: string]: Array<{
        category: TSettingsCategory;
        name: string | string[];
        owner?: string;
    }>;
}
export declare const makeSchema: (params: MakeSchemaParams) => {
    typeDefs: string;
    resolvers: any;
};
export {};
