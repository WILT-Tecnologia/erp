import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { DateFieldComponent } from '../../shared/components/fields/date-field/date-field.component';
import { EmailFieldComponent } from '../../shared/components/fields/email-field/email-field.component';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { fromIsoDate, toIsoDate } from '../../shared/utils/date.util';
import { type Church, type ChurchFormValue, type ChurchStatus } from './church.model';

export interface ChurchFormDialogData {
  church?: Church;
}

const STATUS_OPTIONS: SelectFieldOption<ChurchStatus>[] = [
  { value: 'active', label: 'Ativa' },
  { value: 'inactive', label: 'Inativa' },
];

@Component({
  selector: 'app-church-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    TextFieldComponent,
    EmailFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './church-form-dialog.component.html',
})
export class ChurchFormDialogComponent {
  data = inject<ChurchFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ChurchFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<ChurchFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.church;
    this.form = this.buildForm();
  }

  private buildForm() {
    const church = this.data.church;
    return this.fb.nonNullable.group({
      name: [church?.name ?? '', Validators.required],
      code: [church?.code ?? '', Validators.required],
      city: [church?.city ?? '', Validators.required],
      state: [church?.state ?? '', [Validators.required, Validators.maxLength(2)]],
      pastor: [church?.pastor ?? '', Validators.required],
      phone: [church?.phone ?? ''],
      email: [church?.email ?? '', Validators.email],
      members: [church?.members ?? 0, [Validators.required, Validators.min(0)]],
      congregations: [church?.congregations ?? 0, [Validators.required, Validators.min(0)]],
      founded_at: [church ? fromIsoDate(church.founded_at) : new Date(), Validators.required],
      status: [church?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const value = this.form.getRawValue();
    const payload: ChurchFormValue = { ...value, founded_at: toIsoDate(value.founded_at) };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
