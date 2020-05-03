
export enum TSettingsCategory {
  general = 'general',
  ui = 'ui',
  contact = 'contact',
  constraint = 'constraint',
  currency = 'currency',
  size = 'size',
  label = 'label',
  other = 'other'
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
