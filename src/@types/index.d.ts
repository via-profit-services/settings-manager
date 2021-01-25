declare module '@via-profit-services/settings-manager' {
  import { Middleware, Context, OutputFilter } from '@via-profit-services/core';
  import { GraphQLFieldResolver } from 'graphql';



  export interface Configuration {
    settings: SettingsMap;
    ownerResolver: OwnerResolverFunc;
  }

 
  export type SettingsMapGroup = Record<string, SettingsMapParams>;
  export type SettingsMap = Record<string, SettingsMapGroup>;
  
  
  export type SettingsMapParams = 
  | SettingsMapParamsEnum
  | SettingsMapParamsString
  | SettingsMapParamsInt
  | SettingsMapParamsBool;

  export type SettingsMapParamsEnum = {
    enum: string[];
    defaultValue: string;
  };

  export type SettingsMapParamsString = {
    string: boolean;
    defaultValue: string;
  };

  export type SettingsMapParamsInt = {
    int: boolean;
    defaultValue: number;
  };

  export type SettingsMapParamsBool = {
    bool: boolean;
    defaultValue: boolean;
  };




  export type Resolvers = {
    [x: string]: {
      [x: string]: GraphQLFieldResolver<unknown, Context>;
    };
  };

  export interface SettingsValue {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    value: string | number | boolean | null;
  }


  export type SchemaBuilderParams = {
    query: {
      categories: Array<{
        name: string;
        type: string;
      }>;
      names: Array<{
        name: string;
        category: string;
        type: string;
        value?: string;
      }>;
      enums: Array<{
        type: string;
        variants: string[];
      }>;
    }
    mutation: {
      categories: Array<{
        name: string;
        type: string;
      }>;
      names: Array<{
        category: string;
        name: string;
        type: string;
        input: string;
        return: string;
      }>;
    }
  }




 

  export type ValuesResolver = Record<keyof SettingsValue, GraphQLFieldResolver<{
    category: string;
    name: string;
  }, Context>>;

  export type MutationResolver = GraphQLFieldResolver<{
    category: string;
  }, Context, {
    value: string | number | boolean;
  }>;

  export type MutationResolverFactory = (props: {
    category: string;
    name: string;
  }) => MutationResolver;

  export type SettingsMiddlewareFactory = (config: Configuration) => Promise<{
    middleware: Middleware;
    resolvers: Resolvers;
    typeDefs: string;
  }>;

  export type SchemaBuilder = (settingsMap: SettingsMap) => {
    typeDefs: string;
    resolvers: Resolvers;
  };




  export type SettingsTableModel = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly owner: string;
    readonly category: string;
    readonly name: string;
    readonly value: string | number | boolean | null;
    readonly comment: string;
  }

  export type SettingsTableModelResult = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly owner: string;
    readonly category: string;
    readonly name: string;
    readonly value: string | number | boolean | null;
    readonly comment: string;
  }


  export interface SettingsNode {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    category: string;
    name: string;
    value: string | number | boolean | null;
    comment: string;
  }


  export type SettingsParsed = Pick<SettingsNode, 'owner' | 'name' | 'category'>;

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
    createSettings(settingsField: Partial<SettingsNode>): Promise<string>;
    /**
     * Permanently remove settings record
     */
    deleteSettings(id: string): Promise<string>;

    resolveSettingsByPsudoIDs(pseudoIds: string[]): Promise<SettingsNode[]>;

    writeDefaultSettings(settingsMap: SettingsMap): Promise<void>;


  }

  export const factory: SettingsMiddlewareFactory;
  export default SettingsMiddlewareFactory;
}


declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { SettingsService, SettingsNode } from '@via-profit-services/settings-manager';

  interface DataLoaderCollection {
    /**
     * Settings dataloader by pseudo IDs
     */
    settingsPseudos: DataLoader<string, Node<SettingsNode>>;
    /**
     * Settings dataloader by IDs
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