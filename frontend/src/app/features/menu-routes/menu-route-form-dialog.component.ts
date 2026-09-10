import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Modal } from '../../layout/modal/modal';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { SwitchFieldComponent } from '../../shared/components/fields/switch-field/switch-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { type MenuRoute } from './menu-route.model';

export interface MenuRouteFormDialogData {
  menuRoute?: MenuRoute;
  menuRoutes: MenuRoute[];
}

@Component({
  selector: 'app-menu-route-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatIconModule,
    TextFieldComponent,
    NumberFieldComponent,
    SelectFieldComponent,
    SwitchFieldComponent,
  ],
  templateUrl: './menu-route-form-dialog.component.html',
})
export class MenuRouteFormDialogComponent {
  data = inject<MenuRouteFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MenuRouteFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<MenuRouteFormDialogComponent['buildForm']>;
  readonly parentOptions: SelectFieldOption<string | null>[];

  constructor() {
    const data = this.data;

    this.isEdit = !!data.menuRoute;
    this.parentOptions = [
      { value: null, label: 'Nenhum (item raiz)' },
      ...data.menuRoutes
        .filter((route) => route.id !== data.menuRoute?.id)
        .map((route) => ({ value: route.id as string | null, label: route.title })),
    ];
    this.form = this.buildForm();
  }

  private buildForm() {
    const menuRoute = this.data.menuRoute;
    return this.fb.nonNullable.group({
      title: [menuRoute?.title ?? '', Validators.required],
      slug: [menuRoute?.slug ?? ''],
      icon: [menuRoute?.icon ?? ''],
      category: [menuRoute?.category ?? '', Validators.required],
      parent_id: this.fb.control<string | null>(menuRoute?.parent_id ?? null),
      sort_order: [menuRoute?.sort_order ?? 0, Validators.required],
      is_active: [menuRoute?.is_active ?? true],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      title: value.title,
      slug: value.slug || null,
      icon: value.icon || null,
      category: value.category,
      parent_id: value.parent_id || null,
      sort_order: value.sort_order,
      is_active: value.is_active,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
