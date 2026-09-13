import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Modal } from '../../layout/modal/modal';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Domain } from './domain.model';
import { DomainFormDialogComponent } from './domain-form-dialog.component';
import { type Organization } from './organization.model';
import { OrganizationService } from './organization.service';

export interface OrganizationDomainsDialogData {
  organization: Organization;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
}

@Component({
  selector: 'app-organization-domains-dialog',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, Modal],
  templateUrl: './organization-domains-dialog.component.html',
})
export class OrganizationDomainsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<OrganizationDomainsDialogComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly organizationService = inject(OrganizationService);
  private readonly notification = inject(NotificationService);
  readonly data = inject<OrganizationDomainsDialogData>(MAT_DIALOG_DATA);

  readonly domains = signal<Domain[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Domain>[] = [
    { key: 'domain', label: 'Domínio', monospace: true },
    { key: 'is_primary', label: 'Primário', valueFn: (row) => (row.is_primary ? 'Sim' : 'Não') },
    { key: 'is_verified', label: 'Verificado', valueFn: (row) => (row.is_verified ? 'Sim' : 'Não') },
    { key: 'verified_at', label: 'Verificado em', valueFn: (row) => formatDate(row.verified_at) },
    { key: 'created_at', label: 'Criado em', valueFn: (row) => formatDate(row.created_at ?? null) },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.organizationService.listDomains(this.data.organization.slug, { perPage: 100 }).subscribe({
      next: (response) => {
        this.domains.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(DomainFormDialogComponent, { width: '480px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.organizationService.createDomain(this.data.organization.slug, value).subscribe({
        next: () => {
          this.notification.success('Domínio criado com sucesso.');
          this.load();
        },
        error: (error) => this.notification.error(error.error?.message ?? 'Erro ao criar domínio.'),
      });
    });
  }

  openEdit(domain: Domain): void {
    const ref = this.dialog.open(DomainFormDialogComponent, { width: '480px', data: { domain } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.organizationService.updateDomain(this.data.organization.slug, domain.id, value).subscribe({
        next: () => {
          this.notification.success('Domínio atualizado com sucesso.');
          this.load();
        },
        error: (error) => this.notification.error(error.error?.message ?? 'Erro ao atualizar domínio.'),
      });
    });
  }

  verify(domain: Domain): void {
    this.organizationService.verifyDomain(this.data.organization.slug, domain.id).subscribe({
      next: () => {
        this.notification.success('Domínio verificado com sucesso.');
        this.load();
      },
      error: (error) => this.notification.error(error.error?.message ?? 'Erro ao verificar domínio.'),
    });
  }

  makePrimary(domain: Domain): void {
    this.organizationService.makeDomainPrimary(this.data.organization.slug, domain.id).subscribe({
      next: () => {
        this.notification.success('Domínio definido como primário.');
        this.load();
      },
      error: (error) => this.notification.error(error.error?.message ?? 'Erro ao definir domínio como primário.'),
    });
  }

  remove(domain: Domain): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir domínio', message: `Deseja excluir o domínio ${domain.domain}?` },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result?.confirmed) return;
      this.organizationService.deleteDomain(this.data.organization.slug, domain.id).subscribe({
        next: () => {
          this.notification.success('Domínio excluído.');
          this.load();
        },
        error: (error) => this.notification.error(error.error?.message ?? 'Erro ao excluir domínio.'),
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
