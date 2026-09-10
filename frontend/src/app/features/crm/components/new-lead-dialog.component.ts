import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../../layout/modal/modal';
import { EmailFieldComponent } from '../../../shared/components/fields/email-field/email-field.component';
import { NumberFieldComponent } from '../../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { ASSIGNEES, type ContactFormValue, type ContactStage, STAGES } from '../contact.model';

export interface NewLeadDialogData {
  organizationId: string;
}

const STAGE_OPTIONS: SelectFieldOption<ContactStage>[] = STAGES.map((stage) => ({ value: stage.id, label: stage.label }));
const ASSIGNEE_OPTIONS: SelectFieldOption<string>[] = ASSIGNEES.map((assignee) => ({ value: assignee, label: assignee }));

@Component({
  selector: 'app-new-lead-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    TextFieldComponent,
    EmailFieldComponent,
    NumberFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './new-lead-dialog.component.html',
})
export class NewLeadDialogComponent {
  data = inject<NewLeadDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<NewLeadDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly stageOptions = STAGE_OPTIONS;
  readonly assigneeOptions = ASSIGNEE_OPTIONS;

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
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
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
