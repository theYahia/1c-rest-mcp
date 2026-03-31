export interface CatalogItem {
  ref: string;
  code: string;
  description: string;
  [key: string]: unknown;
}

export interface Document {
  ref: string;
  number: string;
  date: string;
  posted: boolean;
  [key: string]: unknown;
}

export interface ListResponse<T> {
  data: T[];
  total?: number;
}
