import { DatePipe } from '@angular/common';
import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type TenantUser } from './tenant-user.model';
import { TenantUserService } from './tenant-user.service';
import { TenantUserFormDialogComponent } from './tenant-user-form-dialog.component';

@Component({
  selector: 'app-tenant-users-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule],
  providers: [DatePipe],
  templateUrl: './tenant-users-page.component.html',
})
export class TenantUsersPageComponent implements OnInit {
  private readonly userService = inject(TenantUserService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);

  readonly users = signal<TenantUser[]>([]);
  readonly loading = signal(false);

  readonly activeCount = computed(() => this.users().filter((u) => u.status === 'Ativo').length);
  readonly suspendedCount = computed(() => this.users().filter((u) => u.status === 'Suspenso').length);

  readonly columns: GridColumn<TenantUser>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'role', label: 'Cargo', sortable: true },
    { key: 'organization', label: 'Organização', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    {
      key: 'last_login_at',
      label: 'Último acesso',
      sortable: true,
      valueFn: (row) => (row.last_login_at ? (this.datePipe.transform(row.last_login_at, 'short') ?? '') : 'Nunca'),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.userService.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(TenantUserFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.userService.create(value).subscribe({
        next: () => {
          this.notification.success('Usuário criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar usuário.'),
      });
    });
  }

  openEdit(user: TenantUser): void {
    const ref = this.dialog.open(TenantUserFormDialogComponent, { width: '520px', data: { user } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.userService.update(user.id, value).subscribe({
        next: () => {
          this.notification.success('Usuário atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar usuário.'),
      });
    });
  }

  remove(user: TenantUser): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir usuário', message: `Deseja excluir ${user.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.notification.success('Usuário excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir usuário.'),
      });
    });
  }
}
