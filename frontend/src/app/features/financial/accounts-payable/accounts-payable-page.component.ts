import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../../shared/services/notification.service';
import { FinancialService } from '../financial.service';
import { type Transaction, type TransactionStatus } from '../transaction.model';
import { TransactionFormDialogComponent } from '../transaction-form-dialog.component';

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
};

@Component({
  selector: 'app-accounts-payable-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule],
  providers: [DatePipe],
  templateUrl: './accounts-payable-page.component.html',
})
export class AccountsPayablePageComponent implements OnInit {
  private readonly financialService = inject(FinancialService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Transaction>[] = [
    { key: 'description', label: 'Descrição', sortable: true },
    { key: 'category', label: 'Categoria', sortable: true },
    { key: 'account', label: 'Conta', sortable: true },
    {
      key: 'amount',
      label: 'Valor',
      sortable: true,
      valueFn: (row) => `R$ ${row.amount.toFixed(2)}`,
    },
    {
      key: 'date',
      label: 'Data',
      sortable: true,
      valueFn: (row) => this.datePipe.transform(row.date, 'dd/MM/yyyy') ?? row.date,
    },
    { key: 'method', label: 'Forma' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      valueFn: (row) => STATUS_LABELS[row.status],
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.financialService.listPayable().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(TransactionFormDialogComponent, {
      width: '560px',
      data: { defaultType: 'despesa' },
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.financialService.create(value).subscribe({
        next: () => {
          this.notification.success('Conta a pagar registrada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao registrar conta a pagar.'),
      });
    });
  }

  openEdit(transaction: Transaction): void {
    const ref = this.dialog.open(TransactionFormDialogComponent, {
      width: '560px',
      data: { transaction, defaultType: 'despesa' },
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.financialService.update(transaction.id, value).subscribe({
        next: () => {
          this.notification.success('Conta a pagar atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar conta a pagar.'),
      });
    });
  }

  remove(transaction: Transaction): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir conta a pagar', message: `Deseja excluir ${transaction.description}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.financialService.delete(transaction.id).subscribe({
        next: () => {
          this.notification.success('Conta a pagar excluída.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir conta a pagar.'),
      });
    });
  }
}
