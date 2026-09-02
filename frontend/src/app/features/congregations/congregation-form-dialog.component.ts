import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Congregation, CongregationFormValue } from './congregation.model';

export interface CongregationFormDialogData {
  congregation?: Congregation;
}

@Component({
  selector: 'app-congregation-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './congregation-form-dialog.component.html',
})
export class CongregationFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CongregationFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<CongregationFormDialogComponent['buildForm']>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CongregationFormDialogData) {
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
