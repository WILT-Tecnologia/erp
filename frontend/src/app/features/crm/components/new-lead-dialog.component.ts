import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Modal } from '../../../layout/modal/modal';
import { ASSIGNEES, type ContactFormValue, STAGES } from '../contact.model';

export interface NewLeadDialogData {
  organizationId: string;
}

@Component({
  selector: 'app-new-lead-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './new-lead-dialog.component.html',
})
export class NewLeadDialogComponent {
  data = inject<NewLeadDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<NewLeadDialogComponent>);

  readonly stages = STAGES;
  readonly assignees = ASSIGNEES;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.email]],
    phone: [''],
    assignee: [ASSIGNEES[0], Validators.required],
    status: [STAGES[0].id, Validators.required],
    value: [0, [Validators.min(0)]],
    tags: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ContactFormValue = {
      organization_id: this.data.organizationId,
      name: value.name,
      email: value.email || null,
      phone: value.phone || null,
      assignee: value.assignee || null,
      status: value.status,
      value: Number(value.value) || 0,
      tags: value.tags
        ? value.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
