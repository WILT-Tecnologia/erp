import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../../layout/modal/modal';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [Modal, MatButtonModule],
  template: `
    <app-modal [modalTitle]="data.title" (closed)="cancel()">
      {{ data.message }}
      <div modal-footer>
        <button mat-button (click)="cancel()">{{ data.cancelLabel ?? 'Cancelar' }}</button>
        <button mat-flat-button color="warn" (click)="confirm()">
          {{ data.confirmLabel ?? 'Excluir' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
