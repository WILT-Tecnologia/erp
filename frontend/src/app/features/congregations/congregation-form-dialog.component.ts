import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { type Congregation, type CongregationFormValue, type CongregationStatus } from './congregation.model';

export interface CongregationFormDialogData {
  congregation?: Congregation;
}

const STATUS_OPTIONS: SelectFieldOption<CongregationStatus>[] = [
  { value: 'active', label: 'Ativa' },
  { value: 'inactive', label: 'Inativa' },
];

@Component({
  selector: 'app-congregation-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, TextFieldComponent, NumberFieldComponent, SelectFieldComponent],
  templateUrl: './congregation-form-dialog.component.html',
})
export class CongregationFormDialogComponent {
  data = inject<CongregationFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CongregationFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<CongregationFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.congregation;
    this.form = this.buildForm();
  }

  private buildForm() {
    const congregation = this.data.congregation;
    return this.fb.nonNullable.group({
      name: [congregation?.name ?? '', Validators.required],
      code: [congregation?.code ?? '', Validators.required],
      church: [congregation?.church ?? 'Igreja Central Demo', Validators.required],
      leader: [congregation?.leader ?? '', Validators.required],
      city: [congregation?.city ?? '', Validators.required],
      state: [congregation?.state ?? 'SP', [Validators.required, Validators.maxLength(2)]],
      members: [congregation?.members ?? 0, [Validators.required, Validators.min(0)]],
      phone: [congregation?.phone ?? ''],
      status: [congregation?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: CongregationFormValue = this.form.getRawValue();
    this.dialogRef.close(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
