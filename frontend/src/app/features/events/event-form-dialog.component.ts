import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { DateFieldComponent } from '../../shared/components/fields/date-field/date-field.component';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { toIsoDate } from '../../shared/utils/date.util';
import { type Event, type EventCategory, type EventFormValue, type EventStatus } from './event.model';

export interface EventFormDialogData {
  event?: Event;
}

const CATEGORIES: EventCategory[] = ['Culto', 'Conferência', 'Retiro', 'Educação', 'Música', 'Batismo', 'Seminário'];

const CATEGORY_OPTIONS: SelectFieldOption<EventCategory>[] = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

const STATUS_OPTIONS: SelectFieldOption<EventStatus>[] = [
  { value: 'scheduled', label: 'Agendado' },
  { value: 'ongoing', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

@Component({
  selector: 'app-event-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    TextFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './event-form-dialog.component.html',
})
export class EventFormDialogComponent {
  data = inject<EventFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EventFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<EventFormDialogComponent['buildForm']>;
  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;

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
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
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
