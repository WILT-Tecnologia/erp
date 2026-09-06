import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { BankAccount, Transaction } from '../transaction.model';
import { FinancialService } from '../financial.service';

const MONTHLY_TREND = [
  { month: 'Mar', receita: 42000, despesa: 28000 },
  { month: 'Abr', receita: 45000, despesa: 30000 },
  { month: 'Mai', receita: 41000, despesa: 32000 },
  { month: 'Jun', receita: 50000, despesa: 31000 },
  { month: 'Jul', receita: 53000, despesa: 33000 },
  { month: 'Ago', receita: 58430, despesa: 35200 },
];

@Component({
  selector: 'app-financial-dashboard-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatCardModule, BaseChartDirective],
  templateUrl: './financial-dashboard-page.component.html',
})
export class FinancialDashboardPageComponent implements OnInit {
  private readonly financialService = inject(FinancialService);

  readonly transactions = signal<Transaction[]>([]);
  readonly accounts = signal<BankAccount[]>([]);

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

  ngOnInit(): void {
    this.financialService.listTransactions().subscribe((transactions) => this.transactions.set(transactions));
    this.financialService.listAccounts().subscribe((accounts) => this.accounts.set(accounts));
  }
}
