import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn, type GridPage } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { OrganizationFormDialogComponent } from './organization-form-dialog.component';
import { OrganizationSubscriptionsDialogComponent } from './organization-subscriptions-dialog.component';

const STATUS_LABELS: Record<Organization['status'], string> = {
  active: 'Ativa',
  suspended: 'Suspensa',
  inactive: 'Inativa',
};

@Component({
  selector: 'app-organizations-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule],
  templateUrl: './organizations-page.component.html',
})
export class OrganizationsPageComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly organizations = signal<Organization[]>([]);
  readonly loading = signal(false);
  readonly totalCount = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  private searchTerm = '';

  readonly columns: GridColumn<Organization>[] = [
    { key: 'name', label: 'Organização', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'plan', label: 'Plano', valueFn: (row) => row.plan?.name ?? 'Sem plano' },
    { key: 'owner_admin', label: 'Responsável', valueFn: (row) => row.owner_admin?.name ?? '—' },
    { key: 'status', label: 'Status', sortable: true, valueFn: (row) => STATUS_LABELS[row.status] },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.organizationService
      .list({ page: this.pageIndex() + 1, perPage: this.pageSize(), search: this.searchTerm || undefined })
      .subscribe({
        next: (response) => {
          this.organizations.set(response.data);
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

  openDashboard(organization: Organization): void {
    // :organizationId route param carries the organization's slug (matches
    // backend route-model binding, which resolves Organization by slug).
    this.router.navigate(['/organizations', organization.slug, 'dashboard']);
  }

  openSubscriptions(organization: Organization): void {
    this.dialog.open(OrganizationSubscriptionsDialogComponent, { width: '900px', data: { organization } });
  }

  openCreate(): void {
    const ref = this.dialog.open(OrganizationFormDialogComponent, { width: '680px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.organizationService.create(value).subscribe({
        next: () => {
          this.notification.success('Organização criada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar organização.'),
      });
    });
  }

  openEdit(organization: Organization): void {
    const ref = this.dialog.open(OrganizationFormDialogComponent, { width: '680px', data: { organization } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.organizationService.update(organization.slug, value).subscribe({
        next: () => {
          this.notification.success('Organização atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar organização.'),
      });
    });
  }

  remove(organization: Organization): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir organização', message: `Deseja excluir ${organization.name}?` },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result?.confirmed) return;
      this.organizationService.delete(organization.slug).subscribe({
        next: () => {
          this.notification.success('Organização excluída.');
          this.load();
        },
        error: (error) => this.notification.error(error.error?.message ?? 'Erro ao excluir organização.'),
      });
    });
  }

  forceRemove(organization: Organization): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir permanentemente',
        message: `Esta ação remove ${organization.name} e o schema do banco de dados permanentemente e não pode ser desfeita. Confirme sua senha para continuar.`,
        confirmLabel: 'Excluir permanentemente',
        requirePassword: true,
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result?.confirmed || !result.password) return;
      this.organizationService.forceDelete(organization.slug, result.password).subscribe({
        next: () => {
          this.notification.success('Organização e schema removidos permanentemente.');
          this.load();
        },
        error: (error) => this.notification.error(error.error?.message ?? 'Erro ao excluir permanentemente.'),
      });
    });
  }

  toggleStatus(organization: Organization): void {
    const action$ =
      organization.status === 'suspended'
        ? this.organizationService.activate(organization.slug)
        : this.organizationService.suspend(organization.slug);

    action$.subscribe({
      next: () => {
        this.notification.success(
          organization.status === 'suspended' ? 'Organização reativada.' : 'Organização suspensa.',
        );
        this.load();
      },
      error: () =>
        this.notification.error(
          organization.status === 'suspended' ? 'Erro ao reativar organização.' : 'Erro ao suspender organização.',
        ),
    });
  }
}
