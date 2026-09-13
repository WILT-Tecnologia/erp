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
import { type Department } from './department.model';
import { DepartmentService } from './department.service';
import { DepartmentFormDialogComponent } from './department-form-dialog.component';

@Component({
  selector: 'app-departments-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './departments-page.component.html',
})
export class DepartmentsPageComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);

  readonly activeCount = computed(() => this.departments().filter((d) => d.status === 'active').length);
  readonly totalMembers = computed(() => this.departments().reduce((sum, d) => sum + d.members, 0));

  readonly columns: GridColumn<Department>[] = [
    { key: 'name', label: 'Departamento', sortable: true },
    { key: 'church', label: 'Igreja', sortable: true },
    { key: 'leader', label: 'Líder', sortable: true },
    { key: 'members', label: 'Membros', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      valueFn: (row) => (row.status === 'active' ? 'Ativo' : 'Inativo'),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.departmentService.list().subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(DepartmentFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.departmentService.create(value).subscribe({
        next: () => {
          this.notification.success('Departamento criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar departamento.'),
      });
    });
  }

  openEdit(department: Department): void {
    const ref = this.dialog.open(DepartmentFormDialogComponent, { width: '520px', data: { department } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.departmentService.update(department.id, value).subscribe({
        next: () => {
          this.notification.success('Departamento atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar departamento.'),
      });
    });
  }

  remove(department: Department): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir departamento', message: `Deseja excluir ${department.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.departmentService.delete(department.id).subscribe({
        next: () => {
          this.notification.success('Departamento excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir departamento.'),
      });
    });
  }
}
