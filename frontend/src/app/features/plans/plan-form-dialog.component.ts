import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Modal } from '../../layout/modal/modal';
import { DescriptionFieldComponent } from '../../shared/components/fields/description-field/description-field.component';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { SwitchFieldComponent } from '../../shared/components/fields/switch-field/switch-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { type Plan, type PlanStatus } from './plan.model';

export interface PlanFormDialogData {
  plan?: Plan;
}

const STATUS_OPTIONS: SelectFieldOption<PlanStatus>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

@Component({
  selector: 'app-plan-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    TextFieldComponent,
    NumberFieldComponent,
    DescriptionFieldComponent,
    SelectFieldComponent,
    SwitchFieldComponent,
  ],
  templateUrl: './plan-form-dialog.component.html',
})
export class PlanFormDialogComponent {
  data = inject<PlanFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PlanFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<PlanFormDialogComponent['buildForm']>;
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.plan;
    this.form = this.buildForm();
  }

  private buildForm() {
    return this.fb.nonNullable.group({
      name: [this.data.plan?.name ?? '', Validators.required],
      slug: [this.data.plan?.slug ?? '', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      description: [this.data.plan?.description ?? ''],
      price_monthly: [this.data.plan?.price_monthly ?? 0, [Validators.required, Validators.min(0)]],
      price_yearly: [this.data.plan?.price_yearly ?? 0, [Validators.required, Validators.min(0)]],
      trial_days: [this.data.plan?.trial_days ?? 14, [Validators.required, Validators.min(0)]],
      max_users: [this.data.plan?.max_users ?? 1, [Validators.required, Validators.min(1)]],
      max_members: [this.data.plan?.max_members ?? 1, [Validators.required, Validators.min(1)]],
      max_storage_gb: [this.data.plan?.max_storage_gb ?? 1, [Validators.required, Validators.min(1)]],
      features: this.fb.nonNullable.control<string[]>(this.data.plan?.features ?? []),
      is_public: [this.data.plan?.is_public ?? true],
      sort_order: [this.data.plan?.sort_order ?? 10, [Validators.required, Validators.min(0)]],
      status: [this.data.plan?.status ?? 'active', Validators.required],
    });
  }

  addFeature(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value) {
      const features = this.form.controls.features.value;
      this.form.controls.features.setValue([...features, value]);
    }
    input.value = '';
  }

  removeFeature(index: number): void {
    const features = this.form.controls.features.value;
    this.form.controls.features.setValue(features.filter((_, i) => i !== index));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
