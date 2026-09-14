export interface GridColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  valueFn?: (row: T) => string;
  /** Largura máxima de truncamento (ellipsis), sobrepõe o padrão de 280px. */
  maxWidth?: string;
  /** 'icon' renderiza o valor dentro de um <mat-icon> em vez de texto puro. */
  type?: 'text' | 'icon';
  /** Classe aplicada ao <mat-icon> quando type === 'icon'. */
  iconClass?: string;
  /**
   * Cor aplicada via [style.color] ao <mat-icon> quando type === 'icon'.
   * Usa estilo inline (em vez de classe) porque o tema do Angular Material
   * sobrescreve classes de cor do Tailwind em <mat-icon>.
   */
  iconColor?: string;
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
