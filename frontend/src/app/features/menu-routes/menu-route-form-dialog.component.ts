import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Modal } from '../../layout/modal/modal';
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './menu-route-form-dialog.component.html',
})
export class MenuRouteFormDialogComponent {
  data = inject<MenuRouteFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MenuRouteFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<MenuRouteFormDialogComponent['buildForm']>;
  readonly parentOptions: MenuRoute[];

  constructor() {
    const data = this.data;

    this.isEdit = !!data.menuRoute;
    this.parentOptions = data.menuRoutes.filter((route) => route.id !== data.menuRoute?.id);
    this.form = this.buildForm();
  }

  private buildForm() {
    const menuRoute = this.data.menuRoute;
    return this.fb.nonNullable.group({
      title: [menuRoute?.title ?? '', Validators.required],
      slug: [menuRoute?.slug ?? ''],
      icon: [menuRoute?.icon ?? ''],
      category: [menuRoute?.category ?? '', Validators.required],
      parent_id: [menuRoute?.parent_id ?? null],
      sort_order: [menuRoute?.sort_order ?? 0, Validators.required],
      is_active: [menuRoute?.is_active ?? true],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
