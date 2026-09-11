import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import {
  type AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { type Admin } from '../../core/auth/admin.model';
import { Modal } from '../../layout/modal/modal';
import { AutocompleteFieldComponent } from '../../shared/components/fields/autocomplete-field/autocomplete-field.component';
import { DateFieldComponent } from '../../shared/components/fields/date-field/date-field.component';
import { DescriptionFieldComponent } from '../../shared/components/fields/description-field/description-field.component';
import { EmailFieldComponent } from '../../shared/components/fields/email-field/email-field.component';
import { MaskedFieldComponent } from '../../shared/components/fields/masked-field/masked-field.component';
import {
  SelectFieldComponent,
  type SelectFieldOption,
} from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../../shared/constants/locale.constants';
import { toIsoDate } from '../../shared/utils/date.util';
import { cellphoneValidator, PASSWORD_HINT, PASSWORD_PATTERN, SLUG_PATTERN } from '../../shared/utils/validators.util';
import { AdminService } from '../admins/admin.service';
import { type Plan } from '../plans/plan.model';
import { PlanService } from '../plans/plan.service';
import { type Organization, type OrganizationStatus } from './organization.model';
import { OrganizationService } from './organization.service';
import { NotificationService } from '../../shared/services/notification.service';

export interface OrganizationFormDialogData {
  organization?: Organization;
}

const STATUS_OPTIONS: SelectFieldOption<OrganizationStatus>[] = [
  { value: 'active', label: 'Ativa' },
  { value: 'suspended', label: 'Suspensa' },
  { value: 'inactive', label: 'Inativa' },
];

const SLUG_ERROR_MESSAGES = {
  pattern: () => 'Use apenas letras minúsculas, números e hífen, sem espaços, acentos ou hífens duplicados.',
  slugTaken: () => 'Este slug já está em uso.',
};

const WHATSAPP_ERROR_MESSAGES = {
  cellphone: () => 'Informe um número de celular válido, com DDD.',
};

const PASSWORD_CONFIRMATION_ERROR_MESSAGES = {
  passwordMismatch: () => 'As senhas não conferem.',
};

function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value;
  return password && control.value !== password ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-organization-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    TextFieldComponent,
    EmailFieldComponent,
    MaskedFieldComponent,
    DescriptionFieldComponent,
    SelectFieldComponent,
    DateFieldComponent,
    AutocompleteFieldComponent,
  ],
  templateUrl: './organization-form-dialog.component.html',
})
export class OrganizationFormDialogComponent implements OnInit {
  data = inject<OrganizationFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<OrganizationFormDialogComponent>);
  private readonly planService = inject(PlanService);
  private readonly adminService = inject(AdminService);
  private readonly organizationService = inject(OrganizationService);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<OrganizationFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;
  readonly languageOptions = LANGUAGE_OPTIONS;
  readonly timezoneOptions = TIMEZONE_OPTIONS;
  readonly slugErrorMessages = SLUG_ERROR_MESSAGES;
  readonly whatsappErrorMessages = WHATSAPP_ERROR_MESSAGES;
  readonly passwordConfirmationErrorMessages = PASSWORD_CONFIRMATION_ERROR_MESSAGES;
  readonly passwordHint = PASSWORD_HINT;
  readonly hidePassword = signal(true);
  readonly hidePasswordConfirmation = signal(true);

  readonly slugValidated = signal(false);
  readonly slugStatus = signal<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  readonly slugSuffixIcon = computed(() => {
    const type = this.slugStatus()?.type;
    if (!type) {
      return null;
    }
    return type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'pending';
  });
  readonly slugSuffixClass = computed(() => {
    const type = this.slugStatus()?.type;
    if (!type) {
      return '';
    }
    return type === 'success' ? 'text-emerald-600!' : type === 'error' ? 'text-red-500!' : 'text-tertiary';
  });
  readonly slugSuffixTooltip = computed(() => this.slugStatus()?.message ?? '');

  plans: Plan[] = [];
  admins: Admin[] = [];

  private slugCheckRequestId = 0;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.organization;
    this.form = this.buildForm();

    if (this.isEdit) {
      this.form.get('first_user')?.disable();
      this.form.get('slug')?.disable();
    } else {
      this.form.controls.slug.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((slug) => {
        this.slugValidated.set(false);
        this.slugStatus.set(null);
        this.setSlugTakenError(false);
        if (slug && !this.form.controls.slug.hasError('pattern')) {
          this.checkSlugAvailability(slug);
        }
      });
    }
  }

  ngOnInit(): void {
    this.planService.list().subscribe((plans) => (this.plans = plans));
    this.adminService.list().subscribe((admins) => (this.admins = admins));
  }

  get planOptions(): SelectFieldOption<string | null>[] {
    return [
      { value: null, label: 'Nenhum' },
      ...this.plans.map((plan) => ({ value: plan.id as string | null, label: plan.name })),
    ];
  }

  get adminOptions(): SelectFieldOption<string | null>[] {
    return [
      { value: null, label: 'Nenhum' },
      ...this.admins.map((admin) => ({ value: admin.id as string | null, label: admin.name })),
    ];
  }

  private buildForm() {
    const organization = this.data.organization;
    return this.fb.nonNullable.group({
      name: [organization?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      slug: [organization?.slug ?? '', [Validators.required, Validators.pattern(SLUG_PATTERN)]],
      legal_name: [organization?.legal_name ?? '', [Validators.minLength(3), Validators.maxLength(150)]],
      cnpj: [organization?.cnpj ?? ''],
      email: [organization?.email ?? '', Validators.email],
      phone: [organization?.phone ?? ''],
      whatsapp: [organization?.whatsapp ?? '', cellphoneValidator],
      description: [organization?.description ?? '', Validators.maxLength(255)],
      founded_at: [organization?.founded_at ? new Date(`${organization.founded_at}T00:00:00`) : null],
      status: [organization?.status ?? 'active', Validators.required],
      timezone: [organization?.timezone ?? 'America/Sao_Paulo', Validators.required],
      language: [organization?.language ?? 'pt-BR', Validators.required],
      plan_id: this.fb.control<string | null>(organization?.plan?.id ?? null),
      owner_admin_id: this.fb.control<string | null>(organization?.owner_admin?.id ?? null),
      first_user: this.fb.nonNullable.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
        password_confirmation: ['', [Validators.required, confirmPasswordValidator]],
      }),
    });
  }

  submit(): void {
    if (!this.isEdit && !this.slugValidated()) {
      this.form.markAllAsTouched();
      this.slugStatus.set({ message: 'Valide a disponibilidade do slug antes de salvar.', type: 'warning' });
      this.notification.warning('Valide a disponibilidade do slug antes de salvar.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const value = this.form.getRawValue();

    const foundedAt = value.founded_at ? toIsoDate(value.founded_at) : undefined;

    if (this.isEdit) {
      this.dialogRef.close({
        name: value.name,
        legal_name: value.legal_name,
        slug: value.slug,
        cnpj: value.cnpj,
        email: value.email,
        phone: value.phone,
        whatsapp: value.whatsapp,
        description: value.description,
        founded_at: foundedAt,
        status: value.status,
        timezone: value.timezone,
        language: value.language,
        plan_id: value.plan_id ?? undefined,
        owner_admin_id: value.owner_admin_id ?? undefined,
      });
      return;
    }

    const firstUser = value.first_user;
    const hasFirstUser = !!firstUser.name && !!firstUser.email && !!firstUser.password;
    this.dialogRef.close({
      name: value.name,
      legal_name: value.legal_name,
      slug: value.slug,
      cnpj: value.cnpj,
      email: value.email,
      phone: value.phone,
      whatsapp: value.whatsapp,
      description: value.description,
      founded_at: foundedAt,
      status: value.status,
      timezone: value.timezone,
      language: value.language,
      plan_id: value.plan_id ?? undefined,
      owner_admin_id: value.owner_admin_id ?? undefined,
      first_user: hasFirstUser ? firstUser : undefined,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private setSlugTakenError(taken: boolean): void {
    const control = this.form.controls.slug;
    const current = control.errors;
    if (taken) {
      control.setErrors({ ...(current ?? {}), slugTaken: true });
    } else {
      const rest = { ...(current ?? {}) };
      delete rest['slugTaken'];
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
  }

  private checkSlugAvailability(slug: string): void {
    const requestId = ++this.slugCheckRequestId;

    this.organizationService.checkSlugAvailable(slug.trim()).subscribe({
      next: (available) => {
        if (requestId !== this.slugCheckRequestId) {
          return;
        }
        this.slugValidated.set(available);
        this.setSlugTakenError(!available);
        if (available) {
          this.slugStatus.set({ message: 'Disponível', type: 'success' });
        } else {
          this.form.controls.slug.markAsTouched();
          this.slugStatus.set({ message: 'Este slug já está em uso', type: 'error' });
        }
      },
      error: () => {
        if (requestId !== this.slugCheckRequestId) {
          return;
        }
        this.slugValidated.set(false);
        this.setSlugTakenError(false);
        this.slugStatus.set({ message: 'Não foi possível validar o slug. Tente novamente.', type: 'warning' });
      },
    });
  }
}
