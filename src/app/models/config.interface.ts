export interface ApiConfig {
  id: string;
  url: string;
  options: Options;
}

export interface Options {
  headers?: Headers;
  withCredentials?: boolean;
}

export interface Headers {
  Authorization: string;
}

export enum Hosts {
  AUTH = 'auth',
  REFERENTIEL = 'ref',
  RECORD = 'rec'
}
