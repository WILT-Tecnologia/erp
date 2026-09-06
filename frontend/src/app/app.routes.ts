import { Routes } from '@angular/router';

import { adminAccessGuard } from './core/auth/admin-access.guard';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { tenantAccessGuard } from './core/auth/tenant-access.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/components/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [adminAccessGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard',
            data: { icon: 'dashboard' },
            loadComponent: () =>
              import('./features/dashboard/dashboard-page.component').then(
                (m) => m.DashboardPageComponent,
              ),
          },
          {
            path: 'admins',
            title: 'Administradores',
            data: { icon: 'supervisor_account' },
            loadComponent: () =>
              import('./features/admins/admins-page.component').then((m) => m.AdminsPageComponent),
          },
          {
            path: 'organizations',
            title: 'Organizações',
            data: { icon: 'business' },
            loadComponent: () =>
              import('./features/organizations/organizations-page.component').then(
                (m) => m.OrganizationsPageComponent,
              ),
          },
          {
            path: 'plans',
            title: 'Planos',
            data: { icon: 'credit_card' },
            loadComponent: () =>
              import('./features/plans/plans-page.component').then((m) => m.PlansPageComponent),
          },
          {
            path: 'crm',
            title: 'CRM',
            data: { icon: 'contacts' },
            loadComponent: () =>
              import('./features/crm/crm-page.component').then((m) => m.CrmPageComponent),
          },
          {
            path: 'global-services/menu-routes',
            title: 'Rotas de Menu',
            data: { icon: 'tune' },
            loadComponent: () =>
              import('./features/menu-routes/menu-routes-page.component').then(
                (m) => m.MenuRoutesPageComponent,
              ),
          },
          {
            path: 'global-services/users',
            title: 'Usuários Globais',
            data: { icon: 'group' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'global-services/profiles',
            title: 'Perfis',
            data: { icon: 'assignment_ind' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'global-services/modules',
            title: 'Módulos',
            data: { icon: 'extension' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
        ],
      },
      {
        path: 'organizations/:organizationId',
        canActivate: [tenantAccessGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard',
            data: { icon: 'dashboard' },
            loadComponent: () =>
              import('./features/organization-dashboard/organization-dashboard-page.component').then(
                (m) => m.OrganizationDashboardPageComponent,
              ),
          },
          {
            path: 'churches',
            title: 'Igrejas',
            data: { icon: 'account_balance' },
            loadComponent: () =>
              import('./features/churches/churches-page.component').then(
                (m) => m.ChurchesPageComponent,
              ),
            children: [
              {
                path: 'dashboard',
                title: 'Dashboard',
                data: { icon: 'dashboard' },
                loadComponent: () =>
                  import('./features/organization-dashboard/organization-dashboard-page.component').then(
                    (m) => m.OrganizationDashboardPageComponent,
                  ),
              },
            ],
          },
          {
            path: 'congregations',
            title: 'Congregações',
            data: { icon: 'groups' },
            loadComponent: () =>
              import('./features/congregations/congregations-page.component').then(
                (m) => m.CongregationsPageComponent,
              ),
          },
          {
            path: 'members',
            title: 'Membros',
            data: { icon: 'group' },
            loadComponent: () =>
              import('./features/members/members-page.component').then(
                (m) => m.MembersPageComponent,
              ),
          },
          {
            path: 'families',
            title: 'Famílias',
            data: { icon: 'family_restroom' },
            loadComponent: () =>
              import('./features/families/families-page.component').then(
                (m) => m.FamiliesPageComponent,
              ),
          },
          {
            path: 'departments',
            title: 'Departamentos',
            data: { icon: 'apartment' },
            loadComponent: () =>
              import('./features/departments/departments-page.component').then(
                (m) => m.DepartmentsPageComponent,
              ),
          },
          {
            path: 'events',
            title: 'Eventos',
            data: { icon: 'event' },
            loadComponent: () =>
              import('./features/events/events-page.component').then((m) => m.EventsPageComponent),
          },
          {
            path: 'financial',
            title: 'Financeiro',
            data: { icon: 'account_balance_wallet' },
            loadComponent: () =>
              import('./features/financial/financial-page.component').then(
                (m) => m.FinancialPageComponent,
              ),
          },
          {
            path: 'users',
            title: 'Usuários',
            data: { icon: 'manage_accounts' },
            loadComponent: () =>
              import('./features/tenant-users/tenant-users-page.component').then(
                (m) => m.TenantUsersPageComponent,
              ),
          },
          {
            path: 'reports',
            title: 'Relatórios',
            data: { icon: 'bar_chart' },
            loadComponent: () =>
              import('./features/reports/reports-page.component').then(
                (m) => m.ReportsPageComponent,
              ),
          },
          {
            path: 'settings',
            title: 'Configurações',
            data: { icon: 'settings' },
            loadComponent: () =>
              import('./features/settings/settings-page.component').then(
                (m) => m.SettingsPageComponent,
              ),
          },
          {
            path: 'educational',
            title: 'Educacional',
            data: { icon: 'school' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'projects',
            title: 'Projetos',
            data: { icon: 'assignment' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'hr',
            title: 'Recursos Humanos',
            data: { icon: 'badge' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'assets',
            title: 'Patrimônio',
            data: { icon: 'inventory_2' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'bi',
            title: 'Business Intelligence',
            data: { icon: 'insights' },
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
        ],
      },
      { path: 'organizations', pathMatch: 'full', redirectTo: 'admin/organizations' },
    ],
  },
  { path: '**', redirectTo: 'admin/dashboard' },
];
