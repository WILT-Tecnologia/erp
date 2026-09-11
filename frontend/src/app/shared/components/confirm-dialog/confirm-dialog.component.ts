import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DEFAULT_WIDTH, Modal } from '../../../layout/modal/modal';
import { PASSWORD_HINT, PASSWORD_PATTERN } from '../../utils/validators.util';
import { TextFieldComponent } from '../fields/text-field/text-field.component';

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
  /**
   * Quando true, exige que o usuário digite a própria senha (atendendo à
   * política padrão de senha forte) para habilitar a confirmação — camada
   * extra para ações irreversíveis, ex.: excluir permanentemente uma
   * organização.
   */
  requirePassword?: boolean;
}

export type ConfirmDialogResult =
  | { confirmed: true; confirmation?: string; password?: string }
  | { confirmed: false };

const COMPACT_WIDTH = 'clamp(320px, 30vw, 480px)';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    Modal,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    TextFieldComponent,
  ],
  template: `
    <app-modal [modalTitle]="data.title" [width]="dialogWidth()" (closed)="cancel()">
      <div class="flex flex-col gap-4">
        @if (isDangerous()) {
          <div class="flex items-start gap-3 rounded-lg bg-error-container px-4 py-3 text-on-error-container">
            <mat-icon>warning</mat-icon>
            <p class="m-0 text-sm">{{ data.message }}</p>
          </div>
        } @else {
          <p class="m-0">{{ data.message }}</p>
        }

        @if (data.requireText) {
          <mat-form-field>
            <mat-label>Digite "{{ data.requireText }}" para confirmar</mat-label>
            <input matInput [value]="input()" (input)="input.set($any($event.target).value)" />
          </mat-form-field>
        }

        @if (data.requirePassword) {
          <app-text-field
            label="Confirme sua senha"
            [type]="hidePassword() ? 'password' : 'text'"
            [formControl]="passwordControl"
            [hint]="passwordHint"
            [errorMessages]="{ pattern: () => passwordHint }"
          >
            <button
              mat-icon-button
              matSuffix
              type="button"
              [attr.aria-label]="hidePassword() ? 'Mostrar senha' : 'Ocultar senha'"
              (click)="hidePassword.set(!hidePassword())"
            >
              <mat-icon>{{ hidePassword() ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
          </app-text-field>
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

  readonly passwordHint = PASSWORD_HINT;

  readonly input = signal('');
  readonly hidePassword = signal(true);

  readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
  });
  private readonly passwordValue = toSignal(this.passwordControl.valueChanges, { initialValue: '' });

  readonly isDangerous = computed(() => !!this.data.requireText || !!this.data.requirePassword);

  readonly dialogWidth = computed(() => (this.data.requirePassword ? COMPACT_WIDTH : DEFAULT_WIDTH));

  readonly canConfirm = computed(() => {
    if (this.data.requireText && this.input() !== this.data.requireText) return false;
    if (this.data.requirePassword) {
      this.passwordValue();
      return this.passwordControl.valid;
    }
    return true;
  });

  cancel(): void {
    this.dialogRef.close({ confirmed: false } satisfies ConfirmDialogResult);
  }

  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
      confirmation: this.data.requireText ? this.input() : undefined,
      password: this.data.requirePassword ? this.passwordControl.value : undefined,
    } satisfies ConfirmDialogResult);
  }
}
