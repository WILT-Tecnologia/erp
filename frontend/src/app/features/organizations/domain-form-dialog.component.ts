import { Component, computed, inject, signal, type WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Modal } from '../../layout/modal/modal';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { DOMAIN_PATTERN } from '../../shared/utils/validators.util';
import { type Domain, type DomainFormValue } from './domain.model';
import { type Organization } from './organization.model';
import { OrganizationService } from './organization.service';

export interface DomainFormDialogData {
  organization: Organization;
  domain?: Domain;
}

const DOMAIN_ERROR_MESSAGES = {
  pattern: () => 'O domínio informado não é válido (ex: minhaigreja.com.br).',
  domainTaken: () => 'Este domínio já está em uso.',
};

@Component({
  selector: 'app-domain-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TextFieldComponent,
  ],
  templateUrl: './domain-form-dialog.component.html',
})
export class DomainFormDialogComponent {
  data = inject<DomainFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DomainFormDialogComponent>);
  private readonly organizationService = inject(OrganizationService);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly domainErrorMessages = DOMAIN_ERROR_MESSAGES;
  readonly form: ReturnType<DomainFormDialogComponent['buildForm']>;

  readonly checkingDomain = signal(false);
  readonly domainValidated: WritableSignal<boolean>;
  readonly domainStatus = signal<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  readonly domainSuffixIcon = computed(() => {
    const type = this.domainStatus()?.type;
    if (!type) {
      return null;
    }
    return type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'pending';
  });
  readonly domainSuffixClass = computed(() => {
    const type = this.domainStatus()?.type;
    if (!type) {
      return '';
    }
    return type === 'success' ? 'text-emerald-600!' : type === 'error' ? 'text-red-500!' : 'text-tertiary';
  });
  readonly domainSuffixTooltip = computed(() => this.domainStatus()?.message ?? '');

  private readonly originalDomain: string;

  constructor() {
    this.isEdit = !!this.data.domain;
    this.originalDomain = this.data.domain?.domain ?? '';
    this.domainValidated = signal(this.isEdit);
    this.form = this.buildForm();

    this.form.controls.domain.valueChanges.subscribe(() => {
      this.domainValidated.set(this.isEdit && this.form.controls.domain.value === this.originalDomain);
      this.domainStatus.set(null);
      this.setDomainTakenError(false);
    });
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

  validateDomain(): void {
    const value = this.form.controls.domain.value?.trim();
    if (!value || this.form.controls.domain.hasError('pattern')) {
      this.form.controls.domain.markAsTouched();
      this.notification.warning('Informe um domínio válido antes de validar.');
      return;
    }

    this.checkingDomain.set(true);
    this.organizationService.checkDomainAvailable(this.data.organization.slug, value).subscribe({
      next: ({ valid, available }) => {
        this.checkingDomain.set(false);
        if (!valid) {
          this.domainValidated.set(false);
          this.setDomainTakenError(false);
          this.domainStatus.set({ message: 'Formato de domínio inválido.', type: 'error' });
          return;
        }

        const isUnchanged = this.isEdit && value === this.originalDomain;
        const ok = available || isUnchanged;
        this.domainValidated.set(ok);
        this.setDomainTakenError(!ok);
        this.domainStatus.set(
          ok ? { message: 'Disponível', type: 'success' } : { message: 'Este domínio já está em uso', type: 'error' },
        );
      },
      error: () => {
        this.checkingDomain.set(false);
        this.domainValidated.set(false);
        this.domainStatus.set({ message: 'Não foi possível validar o domínio. Tente novamente.', type: 'warning' });
      },
    });
  }

  submit(): void {
    if (!this.domainValidated()) {
      this.form.markAllAsTouched();
      this.domainStatus.set({ message: 'Valide o domínio antes de salvar.', type: 'warning' });
      this.notification.warning('Valide o domínio antes de salvar.');
      return;
    }

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

  private setDomainTakenError(taken: boolean): void {
    const control = this.form.controls.domain;
    const current = control.errors;
    if (taken) {
      control.setErrors({ ...(current ?? {}), domainTaken: true });
    } else {
      const rest = { ...(current ?? {}) };
      delete rest['domainTaken'];
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
  }
}
