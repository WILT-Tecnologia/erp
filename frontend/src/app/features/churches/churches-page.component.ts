import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Church } from './church.model';
import { ChurchService } from './church.service';
import { ChurchFormDialogComponent } from './church-form-dialog.component';

@Component({
  selector: 'app-churches-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './churches-page.component.html',
})
export class ChurchesPageComponent implements OnInit {
  private readonly churchService = inject(ChurchService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly churches = signal<Church[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Church>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'code', label: 'Código', sortable: true },
    { key: 'city', label: 'Cidade', sortable: true, valueFn: (row) => `${row.city}/${row.state}` },
    { key: 'pastor', label: 'Pastor responsável', sortable: true },
    { key: 'members', label: 'Membros', sortable: true },
    { key: 'congregations', label: 'Congregações', sortable: true },
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
    this.churchService.list().subscribe({
      next: (churches) => {
        this.churches.set(churches);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(ChurchFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.churchService.create(value).subscribe({
        next: () => {
          this.notification.success('Igreja criada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar igreja.'),
      });
    });
  }

  openEdit(church: Church): void {
    const ref = this.dialog.open(ChurchFormDialogComponent, { width: '560px', data: { church } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.churchService.update(church.id, value).subscribe({
        next: () => {
          this.notification.success('Igreja atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar igreja.'),
      });
    });
  }

  remove(church: Church): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir igreja', message: `Deseja excluir ${church.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.churchService.delete(church.id).subscribe({
        next: () => {
          this.notification.success('Igreja excluída.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir igreja.'),
      });
    });
  }
}
