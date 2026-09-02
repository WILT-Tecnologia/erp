import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';

import { OrganizationContextService } from '../../core/organization/organization-context.service';
import { CongregationService } from '../congregations/congregation.service';
import { ChurchService } from '../churches/church.service';
import { DepartmentService } from '../departments/department.service';
import { EventService } from '../events/event.service';
import { FamilyService } from '../families/family.service';
import { FinancialService } from '../financial/financial.service';
import { MemberService } from '../members/member.service';

interface OrganizationSummary {
  churches: number;
  congregations: number;
  members: number;
  families: number;
  departments: number;
  events: number;
  balance: number;
}

@Component({
  selector: 'app-organization-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  templateUrl: './organization-dashboard-page.component.html',
})
export class OrganizationDashboardPageComponent implements OnInit {
  private readonly churchService = inject(ChurchService);
  private readonly congregationService = inject(CongregationService);
  private readonly memberService = inject(MemberService);
  private readonly familyService = inject(FamilyService);
  private readonly departmentService = inject(DepartmentService);
  private readonly eventService = inject(EventService);
  private readonly financialService = inject(FinancialService);

  readonly organizationContext = inject(OrganizationContextService);
  readonly organization = this.organizationContext.organization;

  readonly loading = signal(true);
  readonly summary = signal<OrganizationSummary | null>(null);

  balanceByAccountChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ data: [], label: 'Saldo' }] };
  membersByStatusChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ data: [], label: 'Membros' }] };

  ngOnInit(): void {
    forkJoin({
      churches: this.churchService.list(),
      congregations: this.congregationService.list(),
      members: this.memberService.list(),
      families: this.familyService.list(),
      departments: this.departmentService.list(),
      events: this.eventService.list(),
      accounts: this.financialService.listAccounts(),
    }).subscribe(({ churches, congregations, members, families, departments, events, accounts }) => {
      this.summary.set({
        churches: churches.length,
        congregations: congregations.length,
        members: members.length,
        families: families.length,
        departments: departments.length,
        events: events.length,
        balance: accounts.reduce((sum, account) => sum + account.balance, 0),
      });

      this.balanceByAccountChartData = {
        labels: accounts.map((account) => account.name),
        datasets: [{ data: accounts.map((account) => account.balance), label: 'Saldo' }],
      };

      const membersByStatus = new Map<string, number>();
      for (const member of members) {
        membersByStatus.set(member.status, (membersByStatus.get(member.status) ?? 0) + 1);
      }
      this.membersByStatusChartData = {
        labels: Array.from(membersByStatus.keys()),
        datasets: [{ data: Array.from(membersByStatus.values()), label: 'Membros' }],
      };

      this.loading.set(false);
    });
  }
}
