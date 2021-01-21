declare module '@via-profit-services/settings-manager' {
  import { Middleware, Context, OutputFilter } from '@via-profit-services/core';

  export interface MakeSchemaParams {
    /** Group name */
    [key: string]: Array<{

      /** Settings category preset */
      category: SettingsCategory;

      /** Settings field name */
      name: string | string[];

      owner?: string;

    }>;
  }

  export interface Configuration {
    settings: MakeSchemaParams;
    ownerResolver: OwnerResolverFunc;
  }

  export type SettingsCategory = 
    | 'general'
    | 'ui'
    | 'contact'
    | 'constraint'
    | 'currency'
    | 'size'
    | 'label'
    | 'other';


  export interface SettingsNode {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    owner: string;
    group: string;
    name: string;
    value: any | null;
    category: SettingsCategory;
    comment: string;
  }

  export type SettingsMiddlewareFactory = (config: Configuration) => {
    middleware: Middleware;
    resolvers: any;
    typeDefs: string;
  };

  export type SettingsParsed = Pick<SettingsNode, 'owner' | 'group' | 'name' | 'category'>;

  /**
   * Settings Manager service constructor props
   */
  export interface SettingsServiceProps {
    context: Context;
  }

  export type OwnerResolverFunc = (context: Context) => string;

  /**
   * Settings manager service
   */
  export class SettingsService {
    props: SettingsServiceProps;
    ownerResolver: OwnerResolverFunc;

    constructor(props: SettingsServiceProps);


    /**
     * Get settings recors list by filter
     */
    getSettings(filter: Partial<OutputFilter>): Promise<SettingsNode[]>;
    /**
     * For Dataloader\
     * Returns settings records list by record IDs
     */
    getSettingsByIds(ids: string[]): Promise<SettingsNode[]>;
    /**
     * Convert settings parameters to pseudo ID string
     */
    dataToPseudoId(data: SettingsParsed): string;
    /**
     * Convert pseudo ID string to settings parameters
     */
    getDataFromPseudoId(pseudoId: string): SettingsParsed;
    /**
     * Returns settings records list by pseudo ID strings
     */
    getSettingsByPseudoIds(pseudoIds: string[]): Promise<SettingsNode[]>;
    /**
     * Update settings record
     */
    updateSettings(id: string, settingsField: Partial<SettingsNode>): Promise<string>;
    /**
     * Create new settings record
     */
    createSettings(settingsField: Omit<SettingsNode, 'createdAt' | 'updatedAt'>): Promise<string>;
    /**
     * Permanently remove settings record
     */
    deleteSettings(id: string): Promise<string>;


  }

  export const factory: SettingsMiddlewareFactory;
  export default SettingsMiddlewareFactory;
}


declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { SettingsService, SettingsNode } from '@via-profit-services/settings-manager';

  interface DataLoaderCollection {
    /**
     * Settings dataloader
     */
    settings: DataLoader<string, Node<SettingsNode>>;
  }

  interface ServicesCollection {
    /**
     * Settings Manager service
     */
    settings: SettingsService;
  }
}