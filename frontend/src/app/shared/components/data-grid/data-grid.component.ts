import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GridStateService } from '../../services/grid-state.service';
import { GridColumn, GridPage, GridSort } from './data-grid.types';

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
export class DataGridComponent<T extends Record<string, any>> implements OnInit, OnChanges, AfterViewInit {
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

  @Output() search = new EventEmitter<string>();
  @Output() page = new EventEmitter<GridPage>();
  @Output() sortChange = new EventEmitter<GridSort>();

  @ContentChild('rowActions') rowActionsTemplate?: TemplateRef<{ $implicit: T }>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  readonly dataSource = new MatTableDataSource<T>([]);
  searchTerm = '';

  constructor(private readonly gridState: GridStateService) {}

  get displayedColumns(): string[] {
    const keys = this.columns.map((c) => c.key);
    return this.showActionsColumn ? [...keys, 'actions'] : keys;
  }

  ngOnInit(): void {
    const state = this.gridState.load(this.persistKey);
    if (state?.pageSize) {
      this.pageSize = state.pageSize;
    }
    if (state?.sortActive) {
      this.searchTerm = this.searchTerm;
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
    return column.valueFn ? column.valueFn(row) : (row[column.key] ?? '');
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    if (this.serverSide) {
      this.search.emit(term);
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
}
