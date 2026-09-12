export interface GridColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  valueFn?: (row: T) => string;
  /** Largura máxima de truncamento (ellipsis), sobrepõe o padrão de 280px. */
  maxWidth?: string;
  /** 'icon' renderiza o valor dentro de um <mat-icon> em vez de texto puro. */
  type?: 'text' | 'icon';
  /** Renderiza a célula com fonte monoespaçada (JetBrains Mono). */
  monospace?: boolean;
}

export interface GridPage {
  pageIndex: number;
  pageSize: number;
}

export interface GridSort {
  active: string;
  direction: 'asc' | 'desc' | '';
}
