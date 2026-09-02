import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../shared/services/notification.service';
import { Organization } from '../organizations/organization.model';
import { OrganizationService } from '../organizations/organization.service';
import { KanbanBoardComponent } from './components/kanban-board.component';
import { LeadDetailDialogComponent } from './components/lead-detail-dialog.component';
import { NewLeadDialogComponent } from './components/new-lead-dialog.component';
import { Contact, ContactStage } from './contact.model';
import { ContactService } from './contact.service';

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
    MatSelectModule,
    KanbanBoardComponent,
  ],
  templateUrl: './crm-page.component.html',
})
export class CrmPageComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly contactService = inject(ContactService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly contacts = signal<Contact[]>([]);
  readonly organizations = signal<Organization[]>([]);
  readonly organizationId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly search = signal('');

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
    this.loadOrganizations();
  }

  private loadOrganizations(): void {
    this.organizationService.list().subscribe({
      next: (orgs) => {
        this.organizations.set(orgs);
        if (!this.organizationId() && orgs.length > 0) {
          this.organizationId.set(orgs[0].id);
          this.loadContacts();
        }
      },
      error: () => this.notification.error('Erro ao carregar organizações.'),
    });
  }

  onOrganizationChange(id: string): void {
    this.organizationId.set(id);
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
