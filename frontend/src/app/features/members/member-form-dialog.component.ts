import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

import { Member, MemberFormValue } from './member.model';

export interface MemberFormDialogData {
  member?: Member;
}

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  templateUrl: './member-form-dialog.component.html',
})
export class MemberFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MemberFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<MemberFormDialogComponent['buildForm']>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: MemberFormDialogData) {
    this.isEdit = !!data.member;
    this.form = this.buildForm();
  }

  private buildForm() {
    const member = this.data.member;
    return this.fb.nonNullable.group({
      name: [member?.name ?? '', Validators.required],
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
