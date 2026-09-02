import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Admin } from '../../core/auth/admin.model';

export interface AdminFormDialogData {
  admin?: Admin;
}

@Component({
  selector: 'app-admin-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-form-dialog.component.html',
})
export class AdminFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AdminFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<AdminFormDialogComponent['buildForm']>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AdminFormDialogData) {
    this.isEdit = !!data.admin;
    this.form = this.buildForm();
  }

  private buildForm() {
    return this.fb.nonNullable.group({
      name: [this.data.admin?.name ?? '', Validators.required],
      email: [this.data.admin?.email ?? '', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.password && value.password !== value.password_confirmation) {
      this.form.controls.password_confirmation.setErrors({ mismatch: true });
      return;
    }
    this.dialogRef.close({
      name: value.name,
      email: value.email,
      ...(value.password ? { password: value.password, password_confirmation: value.password_confirmation } : {}),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
