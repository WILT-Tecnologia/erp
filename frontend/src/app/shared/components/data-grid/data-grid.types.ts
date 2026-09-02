export interface GridColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  valueFn?: (row: T) => string;
}

export interface GridPage {
  pageIndex: number;
  pageSize: number;
}

export interface GridSort {
  active: string;
  direction: 'asc' | 'desc' | '';
}
