import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { type Admin } from '../../core/auth/admin.model';
import { Modal } from '../../layout/modal/modal';
import { EmailFieldComponent } from '../../shared/components/fields/email-field/email-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';

export interface AdminFormDialogData {
  admin?: Admin;
}

@Component({
  selector: 'app-admin-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, TextFieldComponent, EmailFieldComponent],
  templateUrl: './admin-form-dialog.component.html',
})
export class AdminFormDialogComponent {
  data = inject<AdminFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AdminFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<AdminFormDialogComponent['buildForm']>;

  constructor() {
    const data = this.data;

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
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
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
