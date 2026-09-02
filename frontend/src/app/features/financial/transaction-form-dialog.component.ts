import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Transaction, TransactionStatus } from './transaction.model';

export interface TransactionFormDialogData {
  transaction?: Transaction;
}

const CATEGORIES = ['Dízimos', 'Ofertas', 'Infraestrutura', 'Utilidades', 'Materiais', 'Eventos', 'Missões', 'Outros'];
const ACCOUNTS = ['Conta Principal', 'Conta Operacional', 'Caixa', 'Poupança Missões'];
const METHODS = [
  'PIX',
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'Transferência',
  'Boleto',
  'Débito automático',
];
const STATUSES: { value: TransactionStatus; label: string }[] = [
  { value: 'pago', label: 'Pago' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
];

@Component({
  selector: 'app-transaction-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './transaction-form-dialog.component.html',
})
export class TransactionFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TransactionFormDialogComponent>);

  readonly isEdit: boolean;
  readonly form: ReturnType<TransactionFormDialogComponent['buildForm']>;
  readonly categories = CATEGORIES;
  readonly accounts = ACCOUNTS;
  readonly methods = METHODS;
  readonly statuses = STATUSES;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TransactionFormDialogData) {
    this.isEdit = !!data.transaction;
    this.form = this.buildForm();
  }

  private buildForm() {
    const transaction = this.data.transaction;
    return this.fb.nonNullable.group({
      type: [transaction?.type ?? 'receita', Validators.required],
      description: [transaction?.description ?? '', Validators.required],
      amount: [transaction?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
      date: [transaction?.date ?? new Date().toISOString().slice(0, 10), Validators.required],
      category: [transaction?.category ?? CATEGORIES[0], Validators.required],
      account: [transaction?.account ?? ACCOUNTS[0], Validators.required],
      method: [transaction?.method ?? METHODS[0], Validators.required],
      status: [transaction?.status ?? 'pago', Validators.required],
    });
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
