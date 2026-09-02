import { Routes } from '@angular/router';

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
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard',
            loadComponent: () =>
              import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
          },
          {
            path: 'admins',
            title: 'Administradores',
            loadComponent: () =>
              import('./features/admins/admins-page.component').then((m) => m.AdminsPageComponent),
          },
          {
            path: 'organizations',
            title: 'Organizações',
            loadComponent: () =>
              import('./features/organizations/organizations-page.component').then(
                (m) => m.OrganizationsPageComponent,
              ),
          },
          {
            path: 'plans',
            title: 'Planos',
            loadComponent: () => import('./features/plans/plans-page.component').then((m) => m.PlansPageComponent),
          },
          {
            path: 'crm',
            title: 'CRM',
            loadComponent: () => import('./features/crm/crm-page.component').then((m) => m.CrmPageComponent),
          },
          {
            path: 'global-services/menu-routes',
            title: 'Rotas de Menu',
            loadComponent: () =>
              import('./features/menu-routes/menu-routes-page.component').then((m) => m.MenuRoutesPageComponent),
          },
          {
            path: 'global-services/users',
            title: 'Usuários Globais',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'global-services/profiles',
            title: 'Perfis',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'global-services/modules',
            title: 'Módulos',
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
            loadComponent: () =>
              import('./features/organization-dashboard/organization-dashboard-page.component').then(
                (m) => m.OrganizationDashboardPageComponent,
              ),
          },
          {
            path: 'churches',
            title: 'Igrejas',
            loadComponent: () =>
              import('./features/churches/churches-page.component').then((m) => m.ChurchesPageComponent),
          },
          {
            path: 'congregations',
            title: 'Congregações',
            loadComponent: () =>
              import('./features/congregations/congregations-page.component').then(
                (m) => m.CongregationsPageComponent,
              ),
          },
          {
            path: 'members',
            title: 'Membros',
            loadComponent: () =>
              import('./features/members/members-page.component').then((m) => m.MembersPageComponent),
          },
          {
            path: 'families',
            title: 'Famílias',
            loadComponent: () =>
              import('./features/families/families-page.component').then((m) => m.FamiliesPageComponent),
          },
          {
            path: 'departments',
            title: 'Departamentos',
            loadComponent: () =>
              import('./features/departments/departments-page.component').then((m) => m.DepartmentsPageComponent),
          },
          {
            path: 'events',
            title: 'Eventos',
            loadComponent: () =>
              import('./features/events/events-page.component').then((m) => m.EventsPageComponent),
          },
          {
            path: 'financial',
            title: 'Financeiro',
            loadComponent: () =>
              import('./features/financial/financial-page.component').then((m) => m.FinancialPageComponent),
          },
          {
            path: 'users',
            title: 'Usuários',
            loadComponent: () =>
              import('./features/tenant-users/tenant-users-page.component').then(
                (m) => m.TenantUsersPageComponent,
              ),
          },
          {
            path: 'reports',
            title: 'Relatórios',
            loadComponent: () =>
              import('./features/reports/reports-page.component').then((m) => m.ReportsPageComponent),
          },
          {
            path: 'settings',
            title: 'Configurações',
            loadComponent: () =>
              import('./features/settings/settings-page.component').then((m) => m.SettingsPageComponent),
          },
          {
            path: 'educational',
            title: 'Educacional',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'projects',
            title: 'Projetos',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'hr',
            title: 'Recursos Humanos',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'assets',
            title: 'Patrimônio',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon-page.component').then(
                (m) => m.ComingSoonPageComponent,
              ),
          },
          {
            path: 'bi',
            title: 'Business Intelligence',
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
