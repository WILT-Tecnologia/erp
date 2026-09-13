import { Component, inject, type OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { type Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { type Subscription, type SubscriptionStatus } from './subscription.model';

export interface OrganizationSubscriptionsDialogData {
  organization: Organization;
}

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em teste',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
}

@Component({
  selector: 'app-organization-subscriptions-dialog',
  standalone: true,
  imports: [Modal, DataGridComponent],
  templateUrl: './organization-subscriptions-dialog.component.html',
})
export class OrganizationSubscriptionsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<OrganizationSubscriptionsDialogComponent>);
  private readonly organizationService = inject(OrganizationService);
  readonly data = inject<OrganizationSubscriptionsDialogData>(MAT_DIALOG_DATA);

  readonly subscriptions = signal<Subscription[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Subscription>[] = [
    { key: 'plan', label: 'Plano', valueFn: (row) => row.plan?.name ?? 'Sem plano' },
    { key: 'status', label: 'Status', valueFn: (row) => STATUS_LABELS[row.status] },
    { key: 'amount', label: 'Valor', valueFn: (row) => formatCurrency(row.amount) },
    {
      key: 'current_period_start',
      label: 'Início do período',
      valueFn: (row) => formatDate(row.current_period_start),
    },
    { key: 'current_period_end', label: 'Fim do período', valueFn: (row) => formatDate(row.current_period_end) },
    { key: 'canceled_at', label: 'Cancelada em', valueFn: (row) => formatDate(row.canceled_at) },
  ];

  ngOnInit(): void {
    this.loading.set(true);
    this.organizationService.listSubscriptions(this.data.organization.slug, { perPage: 100 }).subscribe({
      next: (response) => {
        this.subscriptions.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
