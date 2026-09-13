import { type Routes } from '@angular/router';

import { adminAccessGuard } from './core/auth/admin-access.guard';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { tenantAccessGuard } from './core/auth/tenant-access.guard';
import { ShellComponent } from './layout/shell/shell.component';

const comingSoon = () =>
  import('./shared/components/coming-soon/coming-soon-page.component').then((m) => m.ComingSoonPageComponent);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/components/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      // ============================================================
      // ADMIN — platform/global scope, no tenant context
      // ============================================================
      {
        path: 'admin',
        canActivate: [adminAccessGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'dashboard',
            title: 'Dashboard',
            data: { icon: 'dashboard', module: 'admin.dashboard' },
            loadComponent: () =>
              import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
          },
          {
            path: 'organizations',
            title: 'Organizações',
            data: { icon: 'business', module: 'admin.organizations' },
            loadComponent: () =>
              import('./features/organizations/organizations-page.component').then((m) => m.OrganizationsPageComponent),
          },
          {
            path: 'plans',
            title: 'Planos',
            data: { icon: 'credit_card', module: 'admin.plans' },
            loadComponent: () => import('./features/plans/plans-page.component').then((m) => m.PlansPageComponent),
          },
          {
            path: 'admins',
            title: 'Administradores',
            data: { icon: 'supervisor_account', module: 'admin.admins' },
            loadComponent: () => import('./features/admins/admins-page.component').then((m) => m.AdminsPageComponent),
          },
          {
            path: 'users',
            title: 'Usuários Globais',
            data: { icon: 'group', module: 'admin.users' },
            loadComponent: comingSoon,
          },
          {
            path: 'profiles',
            title: 'Perfis Globais',
            data: { icon: 'assignment_ind', module: 'admin.profiles' },
            loadComponent: comingSoon,
          },
          {
            path: 'modules',
            title: 'Módulos',
            data: { icon: 'extension', module: 'admin.modules' },
            loadComponent: comingSoon,
          },
          {
            path: 'systems',
            title: 'Sistemas',
            data: { icon: 'dns', module: 'admin.systems' },
            loadComponent: comingSoon,
          },
          {
            path: 'audit-logs',
            title: 'Logs de Auditoria',
            data: { icon: 'fact_check', module: 'admin.audit-logs' },
            loadComponent: comingSoon,
          },
          {
            path: 'menu-routes',
            title: 'Itens de menu',
            data: { icon: 'tune', module: 'admin.menu-routes' },
            loadComponent: () =>
              import('./features/menu-routes/menu-routes-page.component').then((m) => m.MenuRoutesPageComponent),
          },
        ],
      },

      // ============================================================
      // ORGANIZATIONS — tenant scope
      // ============================================================
      {
        path: 'organizations/:organizationId',
        canActivate: [tenantAccessGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

          {
            path: 'dashboard',
            title: 'Dashboard',
            data: { icon: 'dashboard', module: 'org.dashboard' },
            loadComponent: () =>
              import('./features/organization-dashboard/organization-dashboard-page.component').then(
                (m) => m.OrganizationDashboardPageComponent,
              ),
          },

          // ---------- CRM ----------
          {
            path: 'crm',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard CRM',
                data: { icon: 'dashboard', module: 'crm.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'contacts',
                title: 'Contatos',
                data: { icon: 'contacts', module: 'crm.contacts' },
                loadComponent: () => import('./features/crm/crm-page.component').then((m) => m.CrmPageComponent),
              },
              {
                path: 'leads',
                title: 'Leads',
                data: { icon: 'person_search', module: 'crm.leads' },
                loadComponent: comingSoon,
              },
              {
                path: 'companies',
                title: 'Empresas',
                data: { icon: 'apartment', module: 'crm.companies' },
                loadComponent: comingSoon,
              },
              {
                path: 'opportunities',
                title: 'Oportunidades',
                data: { icon: 'trending_up', module: 'crm.opportunities' },
                loadComponent: comingSoon,
              },
              {
                path: 'pipelines',
                title: 'Funis',
                data: { icon: 'filter_alt', module: 'crm.pipelines' },
                loadComponent: comingSoon,
              },
              {
                path: 'activities',
                title: 'Atividades',
                data: { icon: 'event_note', module: 'crm.activities' },
                loadComponent: comingSoon,
              },
              {
                path: 'campaigns',
                title: 'Campanhas',
                data: { icon: 'campaign', module: 'crm.campaigns' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios CRM',
                data: { icon: 'bar_chart', module: 'crm.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- EDUCATIONAL ----------
          {
            path: 'educational',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard Educacional',
                data: { icon: 'dashboard', module: 'educational.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'people',
                title: 'Pessoas',
                data: { icon: 'groups' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'students' },
                  {
                    path: 'students',
                    title: 'Alunos',
                    data: { icon: 'school', module: 'educational.people.students' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'teachers',
                    title: 'Professores',
                    data: { icon: 'person', module: 'educational.people.teachers' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'academic',
                title: 'Estrutura Acadêmica',
                data: { icon: 'account_balance' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'courses' },
                  {
                    path: 'academic-periods',
                    title: 'Períodos Letivos',
                    data: { icon: 'date_range', module: 'educational.academic.academic-periods' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'courses',
                    title: 'Cursos',
                    data: { icon: 'menu_book', module: 'educational.academic.courses' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'curriculum-matrices',
                    title: 'Matrizes Curriculares',
                    data: { icon: 'schema', module: 'educational.academic.curriculum-matrices' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'curriculum-structures',
                    title: 'Estruturas Curriculares',
                    data: {
                      icon: 'account_tree',
                      module: 'educational.academic.curriculum-structures',
                    },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'subjects',
                    title: 'Disciplinas',
                    data: { icon: 'book', module: 'educational.academic.subjects' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'offers',
                title: 'Ofertas',
                data: { icon: 'groups_2' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'classes' },
                  {
                    path: 'classes',
                    title: 'Turmas',
                    data: { icon: 'groups_2', module: 'educational.offers.classes' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'class-subjects',
                    title: 'Disciplinas da Turma',
                    data: { icon: 'library_books', module: 'educational.offers.class-subjects' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'enrollment',
                title: 'Matrículas',
                data: { icon: 'how_to_reg' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'enrollments' },
                  {
                    path: 'enrollments',
                    title: 'Matrículas',
                    data: { icon: 'how_to_reg', module: 'educational.enrollment.enrollments' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'renewals',
                    title: 'Renovações',
                    data: { icon: 'autorenew', module: 'educational.enrollment.renewals' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'transfers',
                    title: 'Transferências',
                    data: { icon: 'compare_arrows', module: 'educational.enrollment.transfers' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'selective-process',
                title: 'Processo Seletivo',
                data: { icon: 'checklist' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'processes' },
                  {
                    path: 'processes',
                    title: 'Processos Seletivos',
                    data: { icon: 'checklist', module: 'educational.selective-process.processes' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'candidates',
                    title: 'Candidatos',
                    data: {
                      icon: 'person_add',
                      module: 'educational.selective-process.candidates',
                    },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'registrations',
                    title: 'Inscrições',
                    data: {
                      icon: 'app_registration',
                      module: 'educational.selective-process.registrations',
                    },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'stages',
                    title: 'Etapas',
                    data: { icon: 'stairs', module: 'educational.selective-process.stages' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'evaluation',
                title: 'Avaliação',
                data: { icon: 'quiz' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'grades' },
                  {
                    path: 'assessments',
                    title: 'Avaliações',
                    data: { icon: 'quiz', module: 'educational.evaluation.assessments' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'grades',
                    title: 'Notas',
                    data: { icon: 'grade', module: 'educational.evaluation.grades' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'research',
                    title: 'Pesquisas',
                    data: { icon: 'science', module: 'educational.evaluation.research' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'library',
                title: 'Biblioteca',
                data: { icon: 'auto_stories' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'books' },
                  {
                    path: 'books',
                    title: 'Acervo',
                    data: { icon: 'auto_stories', module: 'educational.library.books' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'loans',
                    title: 'Empréstimos',
                    data: { icon: 'assignment_return', module: 'educational.library.loans' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'reservations',
                    title: 'Reservas',
                    data: { icon: 'bookmark', module: 'educational.library.reservations' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'financial',
                title: 'Financeiro',
                data: { icon: 'account_balance_wallet' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'payment-plans' },
                  {
                    path: 'payment-plans',
                    title: 'Planos de Pagamento',
                    data: { icon: 'request_quote', module: 'educational.financial.payment-plans' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'scholarships',
                    title: 'Bolsas',
                    data: {
                      icon: 'volunteer_activism',
                      module: 'educational.financial.scholarships',
                    },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'contracts',
                    title: 'Contratos',
                    data: { icon: 'description', module: 'educational.financial.contracts' },
                    loadComponent: comingSoon,
                  },
                ],
              },
            ],
          },

          // ---------- FINANCIAL ----------
          {
            path: 'financial',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard Financeiro',
                data: { icon: 'dashboard', module: 'financial.dashboard' },
                loadComponent: () =>
                  import('./features/financial/dashboard/financial-dashboard-page.component').then(
                    (m) => m.FinancialDashboardPageComponent,
                  ),
              },
              {
                path: 'registers',
                title: 'Cadastros',
                data: { icon: 'list' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'customers' },
                  {
                    path: 'customers',
                    title: 'Clientes',
                    data: { icon: 'person', module: 'financial.registers.customers' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'suppliers',
                    title: 'Fornecedores',
                    data: { icon: 'local_shipping', module: 'financial.registers.suppliers' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'transaction-categories',
                    title: 'Categorias',
                    data: { icon: 'label', module: 'financial.registers.transaction-categories' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'cost-centers',
                    title: 'Centros de Custo',
                    data: { icon: 'account_tree', module: 'financial.registers.cost-centers' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'transactions',
                title: 'Transações',
                data: { icon: 'receipt_long', module: 'financial.transactions' },
                loadComponent: () =>
                  import('./features/financial/transactions/transactions-page.component').then(
                    (m) => m.TransactionsPageComponent,
                  ),
              },
              {
                path: 'accounts-payable',
                title: 'Contas a Pagar',
                data: { icon: 'arrow_upward', module: 'financial.accounts-payable' },
                loadComponent: () =>
                  import('./features/financial/accounts-payable/accounts-payable-page.component').then(
                    (m) => m.AccountsPayablePageComponent,
                  ),
              },
              {
                path: 'accounts-receivable',
                title: 'Contas a Receber',
                data: { icon: 'arrow_downward', module: 'financial.accounts-receivable' },
                loadComponent: () =>
                  import('./features/financial/accounts-receivable/accounts-receivable-page.component').then(
                    (m) => m.AccountsReceivablePageComponent,
                  ),
              },
              {
                path: 'bank-accounts',
                title: 'Contas Bancárias',
                data: { icon: 'account_balance', module: 'financial.bank-accounts' },
                loadComponent: () =>
                  import('./features/financial/bank-accounts/bank-accounts-page.component').then(
                    (m) => m.BankAccountsPageComponent,
                  ),
              },
              {
                path: 'reconciliation',
                title: 'Conciliação',
                data: { icon: 'fact_check', module: 'financial.reconciliation' },
                loadComponent: comingSoon,
              },
              {
                path: 'transfers',
                title: 'Transferências',
                data: { icon: 'swap_horiz', module: 'financial.transfers' },
                loadComponent: comingSoon,
              },
              {
                path: 'budget',
                title: 'Orçamento',
                data: { icon: 'pie_chart' },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'budgets' },
                  {
                    path: 'budgets',
                    title: 'Orçamentos',
                    data: { icon: 'pie_chart', module: 'financial.budget.budgets' },
                    loadComponent: comingSoon,
                  },
                  {
                    path: 'budget-categories',
                    title: 'Categorias Orçamentárias',
                    data: { icon: 'category', module: 'financial.budget.budget-categories' },
                    loadComponent: comingSoon,
                  },
                ],
              },
              {
                path: 'boletos',
                title: 'Boletos',
                data: { icon: 'barcode', module: 'financial.boletos' },
                loadComponent: comingSoon,
              },
              {
                path: 'pix',
                title: 'Pix',
                data: { icon: 'qr_code', module: 'financial.pix' },
                loadComponent: comingSoon,
              },
              {
                path: 'cards',
                title: 'Cartões',
                data: { icon: 'credit_card', module: 'financial.cards' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios Financeiros',
                data: { icon: 'bar_chart', module: 'financial.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- CHURCH ----------
          {
            path: 'church',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard da Igreja',
                data: { icon: 'dashboard', module: 'church.dashboard' },
                loadComponent: () =>
                  import('./features/organization-dashboard/organization-dashboard-page.component').then(
                    (m) => m.OrganizationDashboardPageComponent,
                  ),
              },
              {
                path: 'churches',
                title: 'Igrejas',
                data: { icon: 'account_balance', module: 'church.churches' },
                loadComponent: () =>
                  import('./features/churches/churches-page.component').then((m) => m.ChurchesPageComponent),
              },
              {
                path: 'congregations',
                title: 'Congregações',
                data: { icon: 'groups', module: 'church.congregations' },
                loadComponent: () =>
                  import('./features/congregations/congregations-page.component').then(
                    (m) => m.CongregationsPageComponent,
                  ),
              },
              {
                path: 'members',
                title: 'Membros',
                data: { icon: 'group', module: 'church.members' },
                loadComponent: () =>
                  import('./features/members/members-page.component').then((m) => m.MembersPageComponent),
              },
              {
                path: 'families',
                title: 'Famílias',
                data: { icon: 'family_restroom', module: 'church.families' },
                loadComponent: () =>
                  import('./features/families/families-page.component').then((m) => m.FamiliesPageComponent),
              },
              {
                path: 'departments',
                title: 'Departamentos',
                data: { icon: 'apartment', module: 'church.departments' },
                loadComponent: () =>
                  import('./features/departments/departments-page.component').then((m) => m.DepartmentsPageComponent),
              },
              {
                path: 'ministries',
                title: 'Ministérios',
                data: { icon: 'volunteer_activism', module: 'church.ministries' },
                loadComponent: comingSoon,
              },
              {
                path: 'groups',
                title: 'Pequenos Grupos',
                data: { icon: 'diversity_3', module: 'church.groups' },
                loadComponent: comingSoon,
              },
              {
                path: 'events',
                title: 'Eventos',
                data: { icon: 'event', module: 'church.events' },
                loadComponent: () =>
                  import('./features/events/events-page.component').then((m) => m.EventsPageComponent),
              },
              {
                path: 'reports',
                title: 'Relatórios da Igreja',
                data: { icon: 'bar_chart', module: 'church.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- HR ----------
          {
            path: 'hr',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard RH',
                data: { icon: 'dashboard', module: 'hr.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'employees',
                title: 'Colaboradores',
                data: { icon: 'badge', module: 'hr.employees' },
                loadComponent: comingSoon,
              },
              {
                path: 'departments',
                title: 'Departamentos',
                data: { icon: 'apartment', module: 'hr.departments' },
                loadComponent: comingSoon,
              },
              {
                path: 'positions',
                title: 'Cargos',
                data: { icon: 'work', module: 'hr.positions' },
                loadComponent: comingSoon,
              },
              {
                path: 'admissions',
                title: 'Admissões',
                data: { icon: 'person_add', module: 'hr.admissions' },
                loadComponent: comingSoon,
              },
              {
                path: 'dismissals',
                title: 'Demissões',
                data: { icon: 'person_remove', module: 'hr.dismissals' },
                loadComponent: comingSoon,
              },
              {
                path: 'vacations',
                title: 'Férias',
                data: { icon: 'beach_access', module: 'hr.vacations' },
                loadComponent: comingSoon,
              },
              {
                path: 'benefits',
                title: 'Benefícios',
                data: { icon: 'redeem', module: 'hr.benefits' },
                loadComponent: comingSoon,
              },
              {
                path: 'payroll',
                title: 'Folha de Pagamento',
                data: { icon: 'payments', module: 'hr.payroll' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios RH',
                data: { icon: 'bar_chart', module: 'hr.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- PROJECTS ----------
          {
            path: 'projects',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard Projetos',
                data: { icon: 'dashboard', module: 'projects.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'projects',
                title: 'Projetos',
                data: { icon: 'assignment', module: 'projects.projects' },
                loadComponent: comingSoon,
              },
              {
                path: 'tasks',
                title: 'Tarefas',
                data: { icon: 'task_alt', module: 'projects.tasks' },
                loadComponent: comingSoon,
              },
              {
                path: 'teams',
                title: 'Equipes',
                data: { icon: 'diversity_3', module: 'projects.teams' },
                loadComponent: comingSoon,
              },
              {
                path: 'time-tracking',
                title: 'Apontamento de Horas',
                data: { icon: 'schedule', module: 'projects.time-tracking' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios de Projetos',
                data: { icon: 'bar_chart', module: 'projects.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- PATRIMONY ----------
          {
            path: 'patrimony',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard Patrimônio',
                data: { icon: 'dashboard', module: 'patrimony.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'assets',
                title: 'Bens',
                data: { icon: 'inventory_2', module: 'patrimony.assets' },
                loadComponent: comingSoon,
              },
              {
                path: 'categories',
                title: 'Categorias',
                data: { icon: 'category', module: 'patrimony.categories' },
                loadComponent: comingSoon,
              },
              {
                path: 'locations',
                title: 'Localizações',
                data: { icon: 'place', module: 'patrimony.locations' },
                loadComponent: comingSoon,
              },
              {
                path: 'transfers',
                title: 'Transferências',
                data: { icon: 'swap_horiz', module: 'patrimony.transfers' },
                loadComponent: comingSoon,
              },
              {
                path: 'maintenance',
                title: 'Manutenção',
                data: { icon: 'build', module: 'patrimony.maintenance' },
                loadComponent: comingSoon,
              },
              {
                path: 'depreciation',
                title: 'Depreciação',
                data: { icon: 'trending_down', module: 'patrimony.depreciation' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios de Patrimônio',
                data: { icon: 'bar_chart', module: 'patrimony.reports' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- BI ----------
          {
            path: 'bi',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
              {
                path: 'dashboard',
                title: 'Dashboard BI',
                data: { icon: 'dashboard', module: 'bi.dashboard' },
                loadComponent: comingSoon,
              },
              {
                path: 'indicators',
                title: 'Indicadores',
                data: { icon: 'speed', module: 'bi.indicators' },
                loadComponent: comingSoon,
              },
              {
                path: 'reports',
                title: 'Relatórios',
                data: { icon: 'bar_chart', module: 'bi.reports' },
                loadComponent: comingSoon,
              },
              {
                path: 'analytics',
                title: 'Analytics',
                data: { icon: 'analytics', module: 'bi.analytics' },
                loadComponent: comingSoon,
              },
            ],
          },

          // ---------- SETTINGS ----------
          {
            path: 'settings',
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'account' },
              {
                path: 'organization',
                title: 'Organização',
                data: { icon: 'domain', module: 'settings.organization' },
                loadComponent: comingSoon,
              },
              {
                path: 'account',
                title: 'Minha Conta',
                data: { icon: 'account_circle', module: 'settings.account' },
                loadComponent: () =>
                  import('./features/settings/settings-page.component').then((m) => m.SettingsPageComponent),
              },
              {
                path: 'users',
                title: 'Usuários',
                data: { icon: 'manage_accounts', module: 'settings.users' },
                loadComponent: () =>
                  import('./features/tenant-users/tenant-users-page.component').then((m) => m.TenantUsersPageComponent),
              },
              {
                path: 'profiles',
                title: 'Perfis',
                data: { icon: 'assignment_ind', module: 'settings.profiles' },
                loadComponent: comingSoon,
              },
              {
                path: 'permissions',
                title: 'Permissões',
                data: { icon: 'lock', module: 'settings.permissions' },
                loadComponent: comingSoon,
              },
              {
                path: 'modules',
                title: 'Módulos',
                data: { icon: 'extension', module: 'settings.modules' },
                loadComponent: comingSoon,
              },
              {
                path: 'integrations',
                title: 'Integrações',
                data: { icon: 'sync_alt', module: 'settings.integrations' },
                loadComponent: comingSoon,
              },
              {
                path: 'notifications',
                title: 'Notificações',
                data: { icon: 'notifications', module: 'settings.notifications' },
                loadComponent: comingSoon,
              },
              {
                path: 'audit-logs',
                title: 'Logs de Auditoria',
                data: { icon: 'fact_check', module: 'settings.audit-logs' },
                loadComponent: comingSoon,
              },
            ],
          },

          // General cross-module reports hub — distinct from every module's own `.../reports` leaf.
          {
            path: 'reports',
            title: 'Relatórios Gerais',
            data: { icon: 'bar_chart', module: 'org.reports' },
            loadComponent: () =>
              import('./features/reports/reports-page.component').then((m) => m.ReportsPageComponent),
          },
        ],
      },

      { path: 'organizations', pathMatch: 'full', redirectTo: 'admin/organizations' },
    ],
  },
  { path: '**', redirectTo: 'admin/dashboard' },
];
