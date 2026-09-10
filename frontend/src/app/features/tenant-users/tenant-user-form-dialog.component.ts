import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { EmailFieldComponent } from '../../shared/components/fields/email-field/email-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { type TenantUser, type TenantUserRole, type TenantUserStatus } from './tenant-user.model';

export interface TenantUserFormDialogData {
  user?: TenantUser;
}

const ROLES: TenantUserRole[] = ['Administrador', 'Gestor', 'Pastor', 'Financeiro', 'Operador'];
const STATUSES: TenantUserStatus[] = ['Ativo', 'Inativo', 'Suspenso'];

function toOptions<T extends string>(values: T[]): SelectFieldOption<T>[] {
  return values.map((value) => ({ value, label: value }));
}

@Component({
  selector: 'app-tenant-user-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, TextFieldComponent, EmailFieldComponent, SelectFieldComponent],
  templateUrl: './tenant-user-form-dialog.component.html',
})
export class TenantUserFormDialogComponent {
  data = inject<TenantUserFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TenantUserFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<TenantUserFormDialogComponent['buildForm']>;
  readonly roleOptions = toOptions(ROLES);
  readonly statusOptions = toOptions(STATUSES);

  constructor() {
    const data = this.data;

    this.isEdit = !!data.user;
    this.form = this.buildForm();
  }

  private buildForm() {
    const user = this.data.user;
    return this.fb.nonNullable.group({
      name: [user?.name ?? '', Validators.required],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      phone: [user?.phone ?? ''],
      role: [user?.role ?? 'Operador', Validators.required],
      organization: [user?.organization ?? 'Igreja Central Demo', Validators.required],
      status: [user?.status ?? 'Ativo', Validators.required],
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
