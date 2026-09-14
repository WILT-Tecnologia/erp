import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { DescriptionFieldComponent } from '../../shared/components/fields/description-field/description-field.component';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { type Department, type DepartmentStatus } from './department.model';

export interface DepartmentFormDialogData {
  department?: Department;
}

const STATUS_OPTIONS: SelectFieldOption<DepartmentStatus>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

@Component({
  selector: 'app-department-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    TextFieldComponent,
    NumberFieldComponent,
    DescriptionFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './department-form-dialog.component.html',
})
export class DepartmentFormDialogComponent {
  data = inject<DepartmentFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DepartmentFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<DepartmentFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.department;
    this.form = this.buildForm();
  }

  private buildForm() {
    const department = this.data.department;
    return this.fb.nonNullable.group({
      name: [department?.name ?? '', Validators.required],
      church: [department?.church ?? '', Validators.required],
      leader: [department?.leader ?? '', Validators.required],
      members: [department?.members ?? 0, [Validators.required, Validators.min(0)]],
      description: [department?.description ?? ''],
      status: [department?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
