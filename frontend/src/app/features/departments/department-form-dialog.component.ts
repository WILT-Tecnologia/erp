import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../layout/modal/modal';
import { type Department } from './department.model';

export interface DepartmentFormDialogData {
  department?: Department;
}

@Component({
  selector: 'app-department-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './department-form-dialog.component.html',
})
export class DepartmentFormDialogComponent {
  data = inject<DepartmentFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DepartmentFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<DepartmentFormDialogComponent['buildForm']>;

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
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
