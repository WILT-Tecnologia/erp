export interface GridColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  valueFn?: (row: T) => string;
  /** Largura máxima de truncamento (ellipsis), sobrepõe o padrão de 280px. */
  maxWidth?: string;
}

export interface GridPage {
  pageIndex: number;
  pageSize: number;
}

export interface GridSort {
  active: string;
  direction: 'asc' | 'desc' | '';
}
