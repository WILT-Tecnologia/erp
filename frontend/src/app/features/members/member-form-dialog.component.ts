import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

import { Modal } from '../../layout/modal/modal';
import {
  SelectFieldComponent,
  type SelectFieldOption,
} from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { type Member, type MemberFormValue, type MemberStatus } from './member.model';

export interface MemberFormDialogData {
  member?: Member;
}

const STATUS_OPTIONS: SelectFieldOption<MemberStatus>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'visitor', label: 'Visitante' },
];

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    TextFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './member-form-dialog.component.html',
})
export class MemberFormDialogComponent {
  data = inject<MemberFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MemberFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<MemberFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.member;
    this.form = this.buildForm();
  }

  private buildForm() {
    const member = this.data.member;
    return this.fb.nonNullable.group({
      name: [
        member?.name ?? '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
        ],
      ],
      email: [member?.email ?? '', [Validators.required, Validators.email]],
      phone: [member?.phone ?? '', Validators.required],
      church: [member?.church ?? 'Igreja Central Demo', Validators.required],
      department: [member?.department ?? '', Validators.required],
      status: [member?.status ?? 'active', Validators.required],
      joined_at: [member?.joined_at ?? '', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: MemberFormValue = this.form.getRawValue();
    this.dialogRef.close(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
