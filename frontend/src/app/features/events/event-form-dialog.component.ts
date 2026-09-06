import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../layout/modal/modal';
import { type Event, type EventCategory, type EventFormValue, type EventStatus } from './event.model';

export interface EventFormDialogData {
  event?: Event;
}

const CATEGORIES: EventCategory[] = ['Culto', 'Conferência', 'Retiro', 'Educação', 'Música', 'Batismo', 'Seminário'];

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'scheduled', label: 'Agendado' },
  { value: 'ongoing', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-event-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './event-form-dialog.component.html',
})
export class EventFormDialogComponent {
  data = inject<EventFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EventFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<EventFormDialogComponent['buildForm']>;
  readonly categories = CATEGORIES;
  readonly statuses = STATUSES;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.event;
    this.form = this.buildForm();
  }

  private buildForm() {
    const event = this.data.event;
    return this.fb.nonNullable.group({
      title: [event?.title ?? '', Validators.required],
      church: [event?.church ?? '', Validators.required],
      category: [event?.category ?? CATEGORIES[0], Validators.required],
      date: [event ? new Date(`${event.date}T00:00:00`) : new Date(), Validators.required],
      location: [event?.location ?? '', Validators.required],
      participants: [event?.participants ?? 0, [Validators.required, Validators.min(0)]],
      capacity: [event?.capacity ?? 100, [Validators.required, Validators.min(1)]],
      status: [event?.status ?? 'scheduled', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: EventFormValue = {
      ...value,
      date: toIsoDate(value.date),
    };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
