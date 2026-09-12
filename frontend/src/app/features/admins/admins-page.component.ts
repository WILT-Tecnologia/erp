import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { type Admin } from '../../core/auth/admin.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn, type GridPage } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { AdminService } from './admin.service';
import { AdminFormDialogComponent } from './admin-form-dialog.component';

@Component({
  selector: 'app-admins-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './admins-page.component.html',
})
export class AdminsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly admins = signal<Admin[]>([]);
  readonly loading = signal(false);
  readonly totalCount = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  private searchTerm = '';

  readonly columns: GridColumn<Admin>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.adminService
      .list({ page: this.pageIndex() + 1, perPage: this.pageSize(), search: this.searchTerm || undefined })
      .subscribe({
        next: (response) => {
          this.admins.set(response.data);
          this.totalCount.set(response.meta?.total ?? response.data.length);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onPage(event: GridPage): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.pageIndex.set(0);
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(AdminFormDialogComponent, { width: '480px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.adminService.create(value).subscribe({
        next: () => {
          this.notification.success('Administrador criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar administrador.'),
      });
    });
  }

  openEdit(admin: Admin): void {
    const ref = this.dialog.open(AdminFormDialogComponent, { width: '480px', data: { admin } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.adminService.update(admin.id, value).subscribe({
        next: () => {
          this.notification.success('Administrador atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar administrador.'),
      });
    });
  }

  remove(admin: Admin): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir administrador', message: `Deseja excluir ${admin.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.adminService.delete(admin.id).subscribe({
        next: () => {
          this.notification.success('Administrador excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir administrador.'),
      });
    });
  }
}
