import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { Modal } from '../../../layout/modal/modal';
import { NotificationService } from '../../../shared/services/notification.service';
import { type Contact, type ContactStage, type ContactTask, STAGES } from '../contact.model';
import { ContactService } from '../contact.service';

export interface LeadDetailDialogData {
  contact: Contact;
}

@Component({
  selector: 'app-lead-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    Modal,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './lead-detail-dialog.component.html',
})
export class LeadDetailDialogComponent {
  private readonly contactService = inject(ContactService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<LeadDetailDialogComponent>);
  readonly data = inject<LeadDetailDialogData>(MAT_DIALOG_DATA);

  readonly stages = STAGES;
  readonly contact = signal<Contact>(this.data.contact);
  readonly note = signal(this.data.contact.notes ?? '');
  readonly newActivityText = signal('');
  readonly newTaskLabel = signal('');
  readonly saving = signal(false);

  currentStage() {
    return this.stages.find((s) => s.id === this.contact().status) ?? this.stages[0];
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDateTime(value: string | null): string {
    return value ? new Date(value).toLocaleString('pt-BR') : '—';
  }

  formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleDateString('pt-BR') : '';
  }

  changeStage(stage: ContactStage): void {
    if (stage === this.contact().status) return;
    this.contactService.updateStatus(this.contact().id, stage).subscribe({
      next: (updated) => {
        this.contact.set(updated);
        this.notification.success('Estágio atualizado.');
      },
      error: () => this.notification.error('Erro ao atualizar estágio.'),
    });
  }

  saveNote(): void {
    this.saving.set(true);
    this.contactService.update(this.contact().id, { notes: this.note() }).subscribe({
      next: (updated) => {
        this.contact.set(updated);
        this.saving.set(false);
        this.notification.success('Nota salva.');
      },
      error: () => {
        this.saving.set(false);
        this.notification.error('Erro ao salvar nota.');
      },
    });
  }

  addActivity(): void {
    const text = this.newActivityText().trim();
    if (!text) return;

    this.contactService.createActivity(this.contact().id, { type: 'note', text }).subscribe({
      next: (activity) => {
        this.contact.update((c) => ({ ...c, activities: [activity, ...c.activities] }));
        this.newActivityText.set('');
      },
      error: () => this.notification.error('Erro ao registrar atividade.'),
    });
  }

  addTask(): void {
    const label = this.newTaskLabel().trim();
    if (!label) return;

    this.contactService.createTask(this.contact().id, { label }).subscribe({
      next: (task) => {
        this.contact.update((c) => ({ ...c, tasks: [...c.tasks, task] }));
        this.newTaskLabel.set('');
      },
      error: () => this.notification.error('Erro ao criar tarefa.'),
    });
  }

  toggleTask(task: ContactTask): void {
    this.contactService.updateTask(this.contact().id, task.id, { done: !task.done }).subscribe({
      next: (updated) => {
        this.contact.update((c) => ({
          ...c,
          tasks: c.tasks.map((t) => (t.id === updated.id ? updated : t)),
        }));
      },
      error: () => this.notification.error('Erro ao atualizar tarefa.'),
    });
  }

  close(): void {
    this.dialogRef.close(this.contact());
  }
}
