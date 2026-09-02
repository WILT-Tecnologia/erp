import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

import { Admin } from '../../core/auth/admin.model';
import { AdminService } from '../admins/admin.service';
import { Plan } from '../plans/plan.model';
import { PlanService } from '../plans/plan.service';
import { Organization } from './organization.model';

export interface OrganizationFormDialogData {
  organization?: Organization;
}

@Component({
  selector: 'app-organization-form-dialog',
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
  templateUrl: './organization-form-dialog.component.html',
})
export class OrganizationFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<OrganizationFormDialogComponent>);
  private readonly planService = inject(PlanService);
  private readonly adminService = inject(AdminService);

  readonly isEdit: boolean;
  readonly form: ReturnType<OrganizationFormDialogComponent['buildForm']>;

  plans: Plan[] = [];
  admins: Admin[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: OrganizationFormDialogData) {
    this.isEdit = !!data.organization;
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.planService.list().subscribe((plans) => (this.plans = plans));
    this.adminService.list().subscribe((admins) => (this.admins = admins));
  }

  private buildForm() {
    const organization = this.data.organization;
    return this.fb.nonNullable.group({
      name: [organization?.name ?? '', Validators.required],
      slug: [organization?.slug ?? '', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      legal_name: [organization?.legal_name ?? ''],
      cnpj: [organization?.cnpj ?? ''],
      email: [organization?.email ?? '', Validators.email],
      phone: [organization?.phone ?? ''],
      whatsapp: [organization?.whatsapp ?? ''],
      description: [organization?.description ?? ''],
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
