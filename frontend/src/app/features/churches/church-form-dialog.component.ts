import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../layout/modal/modal';
import { type Church, type ChurchFormValue } from './church.model';

export interface ChurchFormDialogData {
  church?: Church;
}

@Component({
  selector: 'app-church-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './church-form-dialog.component.html',
})
export class ChurchFormDialogComponent {
  data = inject<ChurchFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ChurchFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<ChurchFormDialogComponent['buildForm']>;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.church;
    this.form = this.buildForm();
  }

  private buildForm() {
    const church = this.data.church;
    return this.fb.nonNullable.group({
      name: [church?.name ?? '', Validators.required],
      code: [church?.code ?? '', Validators.required],
      city: [church?.city ?? '', Validators.required],
      state: [church?.state ?? '', [Validators.required, Validators.maxLength(2)]],
      pastor: [church?.pastor ?? '', Validators.required],
      phone: [church?.phone ?? ''],
      email: [church?.email ?? '', Validators.email],
      members: [church?.members ?? 0, [Validators.required, Validators.min(0)]],
      congregations: [church?.congregations ?? 0, [Validators.required, Validators.min(0)]],
      founded_at: [church?.founded_at ?? '', Validators.required],
      status: [church?.status ?? 'active', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: ChurchFormValue = this.form.getRawValue();
    this.dialogRef.close(value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
