import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Plan } from './plan.model';
import { PlanService } from './plan.service';
import { PlanFormDialogComponent } from './plan-form-dialog.component';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './plans-page.component.html',
})
export class PlansPageComponent implements OnInit {
  private readonly planService = inject(PlanService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly plans = signal<Plan[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Plan>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    {
      key: 'price_monthly',
      label: 'Preço mensal',
      sortable: true,
      valueFn: (row) => `R$ ${row.price_monthly.toFixed(2)}`,
    },
    {
      key: 'is_public',
      label: 'Público',
      valueFn: (row) => (row.is_public ? 'Sim' : 'Não'),
    },
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
    this.planService.list().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(PlanFormDialogComponent, { width: '640px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.planService.create(value).subscribe({
        next: () => {
          this.notification.success('Plano criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar plano.'),
      });
    });
  }

  openEdit(plan: Plan): void {
    const ref = this.dialog.open(PlanFormDialogComponent, { width: '640px', data: { plan } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.planService.update(plan.id, value).subscribe({
        next: () => {
          this.notification.success('Plano atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar plano.'),
      });
    });
  }

  remove(plan: Plan): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir plano', message: `Deseja excluir o plano ${plan.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.planService.delete(plan.id).subscribe({
        next: () => {
          this.notification.success('Plano excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir plano.'),
      });
    });
  }
}
