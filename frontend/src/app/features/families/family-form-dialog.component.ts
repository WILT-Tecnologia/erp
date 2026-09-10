import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { type Family, type FamilyFormValue, type FamilyStatus } from './family.model';

export interface FamilyFormDialogData {
  family?: Family;
}

const STATUS_OPTIONS: SelectFieldOption<FamilyStatus>[] = [
  { value: 'active', label: 'Ativa' },
  { value: 'inactive', label: 'Inativa' },
];

@Component({
  selector: 'app-family-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, TextFieldComponent, NumberFieldComponent, SelectFieldComponent],
  templateUrl: './family-form-dialog.component.html',
})
export class FamilyFormDialogComponent {
  data = inject<FamilyFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<FamilyFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<FamilyFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.family;
    this.form = this.buildForm();
  }

  private buildForm() {
    const family = this.data.family;
    return this.fb.nonNullable.group({
      name: [family?.name ?? '', Validators.required],
      leader: [family?.leader ?? '', Validators.required],
      members: [family?.members ?? 1, [Validators.required, Validators.min(1)]],
      church: [family?.church ?? 'Igreja Central Demo', Validators.required],
      address: [family?.address ?? '', Validators.required],
      status: [family?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const value: FamilyFormValue = this.form.getRawValue();
    this.dialogRef.close(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
