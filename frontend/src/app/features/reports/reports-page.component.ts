import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { type ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ThemeService } from '../../core/theme/theme.service';
import { NotificationService } from '../../shared/services/notification.service';
import { memberGrowth, membersByDepartment, periodSummary, reportCards, revenueTrend } from './reports-data';

// Static fallback for SSR, before the theme's CSS custom properties can be resolved.
const FALLBACK_PIE_COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#F59E0B', '#0EA5E9'];

const PIE_COLOR_VARS = [
  '--mat-sys-primary',
  '--mat-sys-secondary',
  '--mat-sys-tertiary',
  '--mat-sys-error',
  '--mat-sys-tertiary-fixed-dim',
];

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './reports-page.component.html',
})
export class ReportsPageComponent {
  private readonly notification = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly reportCards = reportCards;
  readonly periodSummary = periodSummary;
  readonly membersByDepartment = membersByDepartment;
  pieColors: string[] = FALLBACK_PIE_COLORS;

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
    datasets: [{ data: membersByDepartment.map((d) => d.value), backgroundColor: this.pieColors }],
  };

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        this.themeService.resolvedScheme();
        this.pieColors = this.resolvePieColors();
        this.departmentsChartData.datasets[0].backgroundColor = this.pieColors;
      });
    }
  }

  exportReport(title: string, format: string): void {
    this.notification.success(`${title} exportado em ${format} (simulação).`);
  }

  private resolvePieColors(): string[] {
    const styles = getComputedStyle(document.documentElement);
    return PIE_COLOR_VARS.map((variable, index) => styles.getPropertyValue(variable).trim() || FALLBACK_PIE_COLORS[index]);
  }
}
