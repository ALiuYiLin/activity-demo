export enum VarLayer {
  Meta = 'meta',
  Derived = 'derived',
  UI = 'ui',
  Option = 'option',
}

export type Config = {
  name: string;

  desc: string;

  type: 'number' | 'string' | 'boolean' | 'array' | 'object' | 'function';

  defaultValue?: number | string | boolean | Array<any> | Record<string, any>;

  layer: VarLayer;
}
