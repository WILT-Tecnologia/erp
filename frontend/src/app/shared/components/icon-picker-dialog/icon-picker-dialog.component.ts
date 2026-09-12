import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Modal } from '../../../layout/modal/modal';
import { MATERIAL_ICON_NAMES } from '../../constants/material-icons.constants';

export interface IconPickerDialogData {
  selected?: string | null;
}

@Component({
  selector: 'app-icon-picker-dialog',
  standalone: true,
  imports: [FormsModule, Modal, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './icon-picker-dialog.component.html',
})
export class IconPickerDialogComponent {
  data = inject<IconPickerDialogData>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<IconPickerDialogComponent>);

  readonly searchTerm = signal('');

  readonly filteredIcons = computed(() => {
    const term = this.searchTerm().trim().toLowerCase().replace(/\s+/g, '_');
    if (!term) return MATERIAL_ICON_NAMES;
    return MATERIAL_ICON_NAMES.filter((name) => name.includes(term));
  });

  select(name: string): void {
    this.dialogRef.close(name);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
