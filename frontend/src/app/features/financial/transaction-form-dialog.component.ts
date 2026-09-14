import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Modal } from '../../layout/modal/modal';
import { DateFieldComponent } from '../../shared/components/fields/date-field/date-field.component';
import { NumberFieldComponent } from '../../shared/components/fields/number-field/number-field.component';
import { SelectFieldComponent, type SelectFieldOption } from '../../shared/components/fields/select-field/select-field.component';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { fromIsoDate, toIsoDate } from '../../shared/utils/date.util';
import { type Transaction, type TransactionStatus } from './transaction.model';

export interface TransactionFormDialogData {
  transaction?: Transaction;
  /** Pre-selects the type when creating from a type-specific page (e.g. Contas a Pagar). */
  defaultType?: Transaction['type'];
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
const STATUS_OPTIONS: SelectFieldOption<TransactionStatus>[] = [
  { value: 'pago', label: 'Pago' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
];

function toOptions(values: string[]): SelectFieldOption<string>[] {
  return values.map((value) => ({ value, label: value }));
}

@Component({
  selector: 'app-transaction-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Modal,
    MatButtonModule,
    MatButtonToggleModule,
    TextFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './transaction-form-dialog.component.html',
})
export class TransactionFormDialogComponent {
  data = inject<TransactionFormDialogData>(MAT_DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TransactionFormDialogComponent>);
  private readonly notification = inject(NotificationService);

  readonly isEdit: boolean;
  readonly form: ReturnType<TransactionFormDialogComponent['buildForm']>;
  readonly categoryOptions = toOptions(CATEGORIES);
  readonly accountOptions = toOptions(ACCOUNTS);
  readonly methodOptions = toOptions(METHODS);
  readonly statusOptions = STATUS_OPTIONS;

  constructor() {
    const data = this.data;

    this.isEdit = !!data.transaction;
    this.form = this.buildForm();
  }

  private buildForm() {
    const transaction = this.data.transaction;
    return this.fb.nonNullable.group({
      type: [transaction?.type ?? this.data.defaultType ?? 'receita', Validators.required],
      description: [transaction?.description ?? '', Validators.required],
      amount: [transaction?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
      date: [fromIsoDate(transaction?.date ?? toIsoDate(new Date())), Validators.required],
      category: [transaction?.category ?? CATEGORIES[0], Validators.required],
      account: [transaction?.account ?? ACCOUNTS[0], Validators.required],
      method: [transaction?.method ?? METHODS[0], Validators.required],
      status: [transaction?.status ?? 'pago', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({ ...value, date: toIsoDate(value.date) });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
