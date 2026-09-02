import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { BankAccount, Transaction, TransactionStatus } from './transaction.model';
import { FinancialService } from './financial.service';
import { TransactionFormDialogComponent } from './transaction-form-dialog.component';

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
};

const MONTHLY_TREND = [
  { month: 'Mar', receita: 42000, despesa: 28000 },
  { month: 'Abr', receita: 45000, despesa: 30000 },
  { month: 'Mai', receita: 41000, despesa: 32000 },
  { month: 'Jun', receita: 50000, despesa: 31000 },
  { month: 'Jul', receita: 53000, despesa: 33000 },
  { month: 'Ago', receita: 58430, despesa: 35200 },
];

@Component({
  selector: 'app-financial-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DataGridComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    BaseChartDirective,
  ],
  providers: [DatePipe],
  templateUrl: './financial-page.component.html',
})
export class FinancialPageComponent implements OnInit {
  private readonly financialService = inject(FinancialService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);

  readonly transactions = signal<Transaction[]>([]);
  readonly accounts = signal<BankAccount[]>([]);
  readonly loading = signal(false);

  readonly totalReceitas = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'receita' && t.status === 'pago')
      .reduce((sum, t) => sum + t.amount, 0),
  );
  readonly totalDespesas = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'despesa' && t.status === 'pago')
      .reduce((sum, t) => sum + t.amount, 0),
  );
  readonly saldo = computed(() => this.totalReceitas() - this.totalDespesas());
  readonly pendente = computed(() =>
    this.transactions()
      .filter((t) => t.status === 'pendente')
      .reduce((sum, t) => sum + t.amount, 0),
  );
  readonly totalAccounts = computed(() => this.accounts().reduce((sum, a) => sum + a.balance, 0));
  readonly recentTransactions = computed(() => this.transactions().slice(0, 6));

  readonly trendChartData: ChartConfiguration<'bar'>['data'] = {
    labels: MONTHLY_TREND.map((m) => m.month),
    datasets: [
      { data: MONTHLY_TREND.map((m) => m.receita), label: 'Receita' },
      { data: MONTHLY_TREND.map((m) => m.despesa), label: 'Despesa' },
    ],
  };

  readonly columns: GridColumn<Transaction>[] = [
    { key: 'description', label: 'Descrição', sortable: true },
    { key: 'category', label: 'Categoria', sortable: true },
    { key: 'account', label: 'Conta', sortable: true },
    {
      key: 'amount',
      label: 'Valor',
      sortable: true,
      valueFn: (row) => `${row.type === 'receita' ? '+ ' : '- '}R$ ${row.amount.toFixed(2)}`,
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
    this.financialService.listTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.financialService.listAccounts().subscribe({
      next: (accounts) => this.accounts.set(accounts),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(TransactionFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.financialService.create(value).subscribe({
        next: () => {
          this.notification.success('Transação registrada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao registrar transação.'),
      });
    });
  }

  openEdit(transaction: Transaction): void {
    const ref = this.dialog.open(TransactionFormDialogComponent, { width: '560px', data: { transaction } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.financialService.update(transaction.id, value).subscribe({
        next: () => {
          this.notification.success('Transação atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar transação.'),
      });
    });
  }

  remove(transaction: Transaction): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir transação', message: `Deseja excluir ${transaction.description}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.financialService.delete(transaction.id).subscribe({
        next: () => {
          this.notification.success('Transação excluída.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir transação.'),
      });
    });
  }
}
