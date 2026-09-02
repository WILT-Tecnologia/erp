import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { NotificationService } from '../../shared/services/notification.service';
import { memberGrowth, membersByDepartment, periodSummary, reportCards, revenueTrend } from './reports-data';

const PIE_COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#F59E0B', '#0EA5E9'];

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './reports-page.component.html',
})
export class ReportsPageComponent {
  private readonly notification = inject(NotificationService);

  readonly reportCards = reportCards;
  readonly periodSummary = periodSummary;
  readonly membersByDepartment = membersByDepartment;
  readonly pieColors = PIE_COLORS;

  readonly revenueChartData: ChartConfiguration<'bar'>['data'] = {
    labels: revenueTrend.map((r) => r.month),
    datasets: [
      { data: revenueTrend.map((r) => r.receita), label: 'Receita' },
      { data: revenueTrend.map((r) => r.despesa), label: 'Despesa' },
    ],
  };

  readonly memberGrowthChartData: ChartConfiguration<'line'>['data'] = {
    labels: memberGrowth.map((m) => m.month),
    datasets: [
      { data: memberGrowth.map((m) => m.novos), label: 'Novos membros' },
      { data: memberGrowth.map((m) => m.visitantes), label: 'Visitantes' },
    ],
  };

  readonly departmentsChartData: ChartConfiguration<'pie'>['data'] = {
    labels: membersByDepartment.map((d) => d.name),
    datasets: [{ data: membersByDepartment.map((d) => d.value), backgroundColor: PIE_COLORS }],
  };

  exportReport(title: string, format: string): void {
    this.notification.success(`${title} exportado em ${format} (simulação).`);
  }
}
