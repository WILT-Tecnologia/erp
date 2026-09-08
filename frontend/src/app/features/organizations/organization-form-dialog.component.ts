import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { type Admin } from '../../core/auth/admin.model';
import { Modal } from '../../layout/modal/modal';
import { DescriptionFieldComponent } from '../../shared/components/fields/description-field/description-field.component';
import { EmailFieldComponent } from '../../shared/components/fields/email-field/email-field.component';
import { MaskedFieldComponent } from '../../shared/components/fields/masked-field/masked-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { cellphoneValidator, SLUG_PATTERN } from '../../shared/utils/validators.util';
import { AdminService } from '../admins/admin.service';
import { type Plan } from '../plans/plan.model';
import { PlanService } from '../plans/plan.service';
import { type Organization, type OrganizationStatus } from './organization.model';

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
};

const WHATSAPP_ERROR_MESSAGES = {
  cellphone: () => 'Informe um número de celular válido, com DDD.',
};

@Component({
  selector: 'app-organization-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatTabsModule,
    TextFieldComponent,
    EmailFieldComponent,
    MaskedFieldComponent,
    DescriptionFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './organization-form-dialog.component.html',
})
export class OrganizationFormDialogComponent implements OnInit {
  data = inject<OrganizationFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<OrganizationFormDialogComponent>);
  private readonly planService = inject(PlanService);
  private readonly adminService = inject(AdminService);

  readonly isEdit: boolean;
  readonly form: ReturnType<OrganizationFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;
  readonly slugErrorMessages = SLUG_ERROR_MESSAGES;
  readonly whatsappErrorMessages = WHATSAPP_ERROR_MESSAGES;

  plans: Plan[] = [];
  admins: Admin[] = [];

  constructor() {
    const data = this.data;

    this.isEdit = !!data.organization;
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.planService.list().subscribe((plans) => (this.plans = plans));
    this.adminService.list().subscribe((admins) => (this.admins = admins));
  }

  get planOptions(): SelectFieldOption<string | null>[] {
    return [{ value: null, label: 'Nenhum' }, ...this.plans.map((plan) => ({ value: plan.id as string | null, label: plan.name }))];
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
      status: [organization?.status ?? 'active', Validators.required],
      timezone: [organization?.timezone ?? 'America/Sao_Paulo', Validators.required],
      language: [organization?.language ?? 'pt-BR', Validators.required],
      plan_id: this.fb.control<string | null>(organization?.plan?.id ?? null),
      owner_admin_id: this.fb.control<string | null>(organization?.owner_admin?.id ?? null),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      ...value,
      plan_id: value.plan_id ?? undefined,
      owner_admin_id: value.owner_admin_id ?? undefined,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
