import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { DOMAIN_PATTERN } from '../../shared/utils/validators.util';
import { type Domain, type DomainFormValue } from './domain.model';

export interface DomainFormDialogData {
  domain?: Domain;
}

const DOMAIN_ERROR_MESSAGES = {
  pattern: () => 'O domínio informado não é válido (ex: minhaigreja.com.br).',
};

@Component({
  selector: 'app-domain-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Modal, MatButtonModule, MatCheckboxModule, TextFieldComponent],
  templateUrl: './domain-form-dialog.component.html',
})
export class DomainFormDialogComponent {
  data = inject<DomainFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DomainFormDialogComponent>);

  readonly isEdit: boolean;
  readonly domainErrorMessages = DOMAIN_ERROR_MESSAGES;
  readonly form: ReturnType<DomainFormDialogComponent['buildForm']>;

  constructor() {
    this.isEdit = !!this.data.domain;
    this.form = this.buildForm();
  }

  private buildForm() {
    const domain = this.data.domain;
    return this.fb.nonNullable.group({
      domain: [
        domain?.domain ?? '',
        [Validators.required, Validators.maxLength(255), Validators.pattern(DOMAIN_PATTERN)],
      ],
      is_primary: [domain?.is_primary ?? false],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      domain: value.domain,
      is_primary: value.is_primary,
    } satisfies DomainFormValue);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
