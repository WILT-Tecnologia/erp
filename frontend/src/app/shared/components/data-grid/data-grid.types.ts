export interface GridColumn<T = unknown> {
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
