import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Modal } from '../../../layout/modal/modal';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Quando informado, exige que o usuário digite este texto exato no campo
   * para habilitar o botão de confirmação (confirmação explícita de ações
   * destrutivas, ex.: excluir permanentemente).
   */
  requireText?: string;
}

export type ConfirmDialogResult = { confirmed: true; confirmation?: string } | { confirmed: false };

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [Modal, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <app-modal [modalTitle]="data.title" (closed)="cancel()">
      <div class="flex flex-col gap-4">
        {{ data.message }}

        @if (data.requireText) {
          <mat-form-field>
            <mat-label>Digite {{ data.requireText }} para confirmar</mat-label>
            <input matInput [value]="input()" (input)="input.set($any($event.target).value)" />
          </mat-form-field>
        }
      </div>

      <div modal-footer>
        <button mat-button (click)="cancel()">{{ data.cancelLabel ?? 'Cancelar' }}</button>
        <button mat-flat-button color="warn" [disabled]="!canConfirm()" (click)="confirm()">
          {{ data.confirmLabel ?? 'Excluir' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  readonly input = signal('');

  readonly canConfirm = computed(() => {
    if (!this.data.requireText) return true;
    return this.input() === this.data.requireText;
  });

  cancel(): void {
    this.dialogRef.close({ confirmed: false } satisfies ConfirmDialogResult);
  }

  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
      confirmation: this.data.requireText ? this.input() : undefined,
    } satisfies ConfirmDialogResult);
  }
}
