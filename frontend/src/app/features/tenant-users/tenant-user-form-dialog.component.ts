import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../layout/modal/modal';
import { type TenantUser, type TenantUserRole, type TenantUserStatus } from './tenant-user.model';

export interface TenantUserFormDialogData {
  user?: TenantUser;
}

const ROLES: TenantUserRole[] = ['Administrador', 'Gestor', 'Pastor', 'Financeiro', 'Operador'];
const STATUSES: TenantUserStatus[] = ['Ativo', 'Inativo', 'Suspenso'];

@Component({
  selector: 'app-tenant-user-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './tenant-user-form-dialog.component.html',
})
export class TenantUserFormDialogComponent {
  data = inject<TenantUserFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TenantUserFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<TenantUserFormDialogComponent['buildForm']>;
  readonly roles = ROLES;
  readonly statuses = STATUSES;

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
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
