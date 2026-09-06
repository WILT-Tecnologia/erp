import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { type ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { type DashboardStats } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly loading = signal(true);

  growthChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ data: [], label: 'Organizações' }] };
  revenueChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Receita' },
      { data: [], label: 'Churn' },
    ],
  };

  ngOnInit(): void {
    this.dashboardService.stats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.growthChartData = {
          labels: stats.growth.map((s) => s.month),
          datasets: [{ data: stats.growth.map((s) => s.total), label: 'Organizações' }],
        };
        this.revenueChartData = {
          labels: stats.revenue_expense_trend.map((s) => s.month),
          datasets: [
            { data: stats.revenue_expense_trend.map((s) => s.revenue), label: 'Receita' },
            { data: stats.revenue_expense_trend.map((s) => s.expense), label: 'Churn' },
          ],
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
