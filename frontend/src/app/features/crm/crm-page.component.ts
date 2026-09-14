import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { NotificationService } from '../../shared/services/notification.service';
import { KanbanBoardComponent } from './components/kanban-board.component';
import { LeadDetailDialogComponent } from './components/lead-detail-dialog.component';
import { NewLeadDialogComponent } from './components/new-lead-dialog.component';
import { type Contact, type ContactStage } from './contact.model';
import { ContactService } from './contact.service';

// NOTE: ContactService calls /admin/contacts, which requires a central Admin
// bearer token. A real tenant end-user session has no such token and will
// get a 401 here until a future /api/tenant/contacts endpoint exists. Super
// admins browsing into an org (who still hold their Admin token) are
// unaffected. This is a known, accepted gap from moving CRM to tenant scope
// ahead of the backend work, not a bug to silently work around.
@Component({
  selector: 'app-crm-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    KanbanBoardComponent,
  ],
  templateUrl: './crm-page.component.html',
})
export class CrmPageComponent implements OnInit {
  private readonly tenantContext = inject(TenantContextService);
  private readonly contactService = inject(ContactService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly contacts = signal<Contact[]>([]);
  readonly loading = signal(false);
  readonly search = signal('');

  readonly organizationId = computed(() => this.tenantContext.organizationSlug());

  readonly filteredContacts = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.contacts();

    return this.contacts().filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.assignee, ...contact.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  });

  readonly totalProposta = computed(() =>
    this.contacts()
      .filter((c) => c.status === 'proposta')
      .reduce((sum, c) => sum + c.value, 0),
  );

  readonly convertidos = computed(() => this.contacts().filter((c) => c.status === 'ganho').length);
  readonly emProposta = computed(() => this.contacts().filter((c) => c.status === 'proposta').length);

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    const organizationId = this.organizationId();
    if (!organizationId) return;

    this.loading.set(true);
    this.contactService.list(organizationId).subscribe({
      next: (response) => {
        this.contacts.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Erro ao carregar contatos.');
      },
    });
  }

  openNew(): void {
    const organizationId = this.organizationId();
    if (!organizationId) return;

    const ref = this.dialog.open(NewLeadDialogComponent, {
      width: '480px',
      data: { organizationId },
    });

    ref.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.contactService.create(payload).subscribe({
        next: () => {
          this.notification.success('Lead criado com sucesso.');
          this.loadContacts();
        },
        error: () => this.notification.error('Erro ao criar lead.'),
      });
    });
  }

  openDetail(contact: Contact): void {
    const ref = this.dialog.open(LeadDetailDialogComponent, {
      width: '600px',
      data: { contact },
    });

    ref.afterClosed().subscribe((updated: Contact | undefined) => {
      if (!updated) return;
      this.contacts.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
    });
  }

  onStageChange(event: { contact: Contact; stage: ContactStage }): void {
    this.contactService.updateStatus(event.contact.id, event.stage).subscribe({
      next: () => this.notification.success('Estágio atualizado.'),
      error: () => {
        this.notification.error('Erro ao atualizar estágio.');
        this.loadContacts();
      },
    });
  }
}
