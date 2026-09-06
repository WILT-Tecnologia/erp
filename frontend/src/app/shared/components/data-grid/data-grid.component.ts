import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule, type Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GridStateService } from '../../services/grid-state.service';
import { type GridColumn, type GridPage, type GridSort } from './data-grid.types';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './data-grid.component.html',
})
export class DataGridComponent<T> implements OnInit, OnChanges, AfterViewInit {
  private readonly gridState = inject(GridStateService);

  @Input({ required: true }) columns: GridColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() persistKey = 'default';
  @Input() serverSide = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50];
  @Input() showActionsColumn = true;
  @Input() emptyMessage = 'Nenhum registro encontrado.';

  @Output() searchChange = new EventEmitter<string>();
  @Output() page = new EventEmitter<GridPage>();
  @Output() sortChange = new EventEmitter<GridSort>();

  @ContentChild('rowActions') rowActionsTemplate?: TemplateRef<{ $implicit: T }>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  readonly dataSource = new MatTableDataSource<T>([]);
  searchTerm = '';

  get displayedColumns(): string[] {
    const keys = this.columns.map((c) => c.key);
    return this.showActionsColumn ? [...keys, 'actions'] : keys;
  }

  ngOnInit(): void {
    const state = this.gridState.load(this.persistKey);
    if (state?.pageSize) {
      this.pageSize = state.pageSize;
    }
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    if (!this.serverSide) {
      this.dataSource.paginator = this.paginator ?? null;
      this.dataSource.sort = this.sort ?? null;
    }
  }

  valueFor(row: T, column: GridColumn<T>): string {
    return column.valueFn ? column.valueFn(row) : String((row as Record<string, unknown>)[column.key] ?? '');
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    if (this.serverSide) {
      this.searchChange.emit(term);
    } else {
      this.dataSource.filter = term.trim().toLowerCase();
    }
  }

  onPage(event: PageEvent): void {
    this.gridState.save(this.persistKey, { pageSize: event.pageSize });
    if (this.serverSide) {
      this.page.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
    }
  }

  onSort(sort: Sort): void {
    this.gridState.save(this.persistKey, { sortActive: sort.active, sortDirection: sort.direction });
    if (this.serverSide) {
      this.sortChange.emit({ active: sort.active, direction: sort.direction });
    }
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange('');
  }
}
