import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../layout/modal/modal';
import { type Family, type FamilyFormValue } from './family.model';

export interface FamilyFormDialogData {
  family?: Family;
}

@Component({
  selector: 'app-family-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './family-form-dialog.component.html',
})
export class FamilyFormDialogComponent {
  data = inject<FamilyFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<FamilyFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<FamilyFormDialogComponent['buildForm']>;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.family;
    this.form = this.buildForm();
  }

  private buildForm() {
    const family = this.data.family;
    return this.fb.nonNullable.group({
      name: [family?.name ?? '', Validators.required],
      leader: [family?.leader ?? '', Validators.required],
      members: [family?.members ?? 1, [Validators.required, Validators.min(1)]],
      church: [family?.church ?? 'Igreja Central Demo', Validators.required],
      address: [family?.address ?? '', Validators.required],
      status: [family?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: FamilyFormValue = this.form.getRawValue();
    this.dialogRef.close(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
