import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Congregation } from './congregation.model';
import { CongregationService } from './congregation.service';
import { CongregationFormDialogComponent } from './congregation-form-dialog.component';

@Component({
  selector: 'app-congregations-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './congregations-page.component.html',
})
export class CongregationsPageComponent implements OnInit {
  private readonly congregationService = inject(CongregationService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly congregations = signal<Congregation[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Congregation>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'code', label: 'Código', sortable: true },
    { key: 'church', label: 'Igreja', sortable: true },
    { key: 'leader', label: 'Líder', sortable: true },
    { key: 'city', label: 'Cidade', sortable: true, valueFn: (row) => `${row.city}/${row.state}` },
    { key: 'members', label: 'Membros', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      valueFn: (row) => (row.status === 'active' ? 'Ativa' : 'Inativa'),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.congregationService.list().subscribe({
      next: (congregations) => {
        this.congregations.set(congregations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(CongregationFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.congregationService.create(value).subscribe({
        next: () => {
          this.notification.success('Congregação criada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar congregação.'),
      });
    });
  }

  openEdit(congregation: Congregation): void {
    const ref = this.dialog.open(CongregationFormDialogComponent, {
      width: '560px',
      data: { congregation },
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.congregationService.update(congregation.id, value).subscribe({
        next: () => {
          this.notification.success('Congregação atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar congregação.'),
      });
    });
  }

  remove(congregation: Congregation): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir congregação', message: `Deseja excluir ${congregation.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.congregationService.delete(congregation.id).subscribe({
        next: () => {
          this.notification.success('Congregação excluída.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir congregação.'),
      });
    });
  }
}
