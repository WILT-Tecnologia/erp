<?php

namespace Database\Seeders\Central;

use App\Models\Central\MenuRoute;
use App\Models\Central\PermissionDefinition;
use Illuminate\Database\Seeder;

class MenuRouteSeeder extends Seeder
{
    /** Slugs written this run — anything else left over from a previous, now-renamed tree gets purged below. */
    private array $seededSlugs = [];


    /**
     * Espelha fielmente a árvore de rotas real de `frontend/src/app/app.routes.ts`
     * (título, slug absoluto, ícone Material — mesma ligature usada em `data.icon`
     * — e filhos). Cada categoria ganha uma permissão de acesso própria
     * ('menu.{slug_da_categoria}'), herdada por todas as rotas/sub-rotas daquela
     * categoria. Rotas que são apenas contêineres de agrupamento no Angular
     * (sem `loadComponent` próprio, só `children` + redirect) também viram um
     * nó aqui — clicável, leva ao primeiro filho — para preservar a mesma
     * hierarquia em árvore que a sidebar usa hoje.
     */
    public function run(): void
    {
        $categories = [
            'Administração' => [
                'icon' => 'security',
                'items' => [
                    ['title' => 'Dashboard', 'slug' => '/admin/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Organizações', 'slug' => '/admin/organizations', 'icon' => 'business'],
                    ['title' => 'Planos', 'slug' => '/admin/plans', 'icon' => 'credit_card'],
                    ['title' => 'Administradores', 'slug' => '/admin/admins', 'icon' => 'supervisor_account'],
                    ['title' => 'Usuários Globais', 'slug' => '/admin/users', 'icon' => 'group'],
                    ['title' => 'Perfis Globais', 'slug' => '/admin/profiles', 'icon' => 'assignment_ind'],
                    ['title' => 'Módulos', 'slug' => '/admin/modules', 'icon' => 'extension'],
                    ['title' => 'Sistemas', 'slug' => '/admin/systems', 'icon' => 'dns'],
                    ['title' => 'Logs de Auditoria', 'slug' => '/admin/audit-logs', 'icon' => 'fact_check'],
                    ['title' => 'Rotas de Menu', 'slug' => '/admin/menu-routes', 'icon' => 'tune'],
                ],
            ],
            'Geral' => [
                'icon' => 'dashboard',
                'items' => [
                    ['title' => 'Dashboard', 'slug' => '/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Relatórios Gerais', 'slug' => '/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'CRM' => [
                'icon' => 'contacts',
                'items' => [
                    ['title' => 'Dashboard CRM', 'slug' => '/crm/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Contatos', 'slug' => '/crm/contacts', 'icon' => 'contacts'],
                    ['title' => 'Leads', 'slug' => '/crm/leads', 'icon' => 'person_search'],
                    ['title' => 'Empresas', 'slug' => '/crm/companies', 'icon' => 'apartment'],
                    ['title' => 'Oportunidades', 'slug' => '/crm/opportunities', 'icon' => 'trending_up'],
                    ['title' => 'Funis', 'slug' => '/crm/pipelines', 'icon' => 'filter_alt'],
                    ['title' => 'Atividades', 'slug' => '/crm/activities', 'icon' => 'event_note'],
                    ['title' => 'Campanhas', 'slug' => '/crm/campaigns', 'icon' => 'campaign'],
                    ['title' => 'Relatórios CRM', 'slug' => '/crm/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Educacional' => [
                'icon' => 'school',
                'items' => [
                    ['title' => 'Dashboard Educacional', 'slug' => '/educational/dashboard', 'icon' => 'dashboard'],
                    [
                        'title' => 'Pessoas',
                        'slug' => '/educational/people',
                        'icon' => 'groups',
                        'children' => [
                            ['title' => 'Alunos', 'slug' => '/educational/people/students', 'icon' => 'school'],
                            ['title' => 'Professores', 'slug' => '/educational/people/teachers', 'icon' => 'person'],
                        ],
                    ],
                    [
                        'title' => 'Estrutura Acadêmica',
                        'slug' => '/educational/academic',
                        'icon' => 'account_balance',
                        'children' => [
                            ['title' => 'Períodos Letivos', 'slug' => '/educational/academic/academic-periods', 'icon' => 'date_range'],
                            ['title' => 'Cursos', 'slug' => '/educational/academic/courses', 'icon' => 'menu_book'],
                            ['title' => 'Matrizes Curriculares', 'slug' => '/educational/academic/curriculum-matrices', 'icon' => 'schema'],
                            ['title' => 'Estruturas Curriculares', 'slug' => '/educational/academic/curriculum-structures', 'icon' => 'account_tree'],
                            ['title' => 'Disciplinas', 'slug' => '/educational/academic/subjects', 'icon' => 'book'],
                        ],
                    ],
                    [
                        'title' => 'Ofertas',
                        'slug' => '/educational/offers',
                        'icon' => 'groups_2',
                        'children' => [
                            ['title' => 'Turmas', 'slug' => '/educational/offers/classes', 'icon' => 'groups_2'],
                            ['title' => 'Disciplinas da Turma', 'slug' => '/educational/offers/class-subjects', 'icon' => 'library_books'],
                        ],
                    ],
                    [
                        'title' => 'Matrículas',
                        'slug' => '/educational/enrollment',
                        'icon' => 'how_to_reg',
                        'children' => [
                            ['title' => 'Matrículas', 'slug' => '/educational/enrollment/enrollments', 'icon' => 'how_to_reg'],
                            ['title' => 'Renovações', 'slug' => '/educational/enrollment/renewals', 'icon' => 'autorenew'],
                            ['title' => 'Transferências', 'slug' => '/educational/enrollment/transfers', 'icon' => 'compare_arrows'],
                        ],
                    ],
                    [
                        'title' => 'Processo Seletivo',
                        'slug' => '/educational/selective-process',
                        'icon' => 'checklist',
                        'children' => [
                            ['title' => 'Processos Seletivos', 'slug' => '/educational/selective-process/processes', 'icon' => 'checklist'],
                            ['title' => 'Candidatos', 'slug' => '/educational/selective-process/candidates', 'icon' => 'person_add'],
                            ['title' => 'Inscrições', 'slug' => '/educational/selective-process/registrations', 'icon' => 'app_registration'],
                            ['title' => 'Etapas', 'slug' => '/educational/selective-process/stages', 'icon' => 'stairs'],
                        ],
                    ],
                    [
                        'title' => 'Avaliação',
                        'slug' => '/educational/evaluation',
                        'icon' => 'quiz',
                        'children' => [
                            ['title' => 'Avaliações', 'slug' => '/educational/evaluation/assessments', 'icon' => 'quiz'],
                            ['title' => 'Notas', 'slug' => '/educational/evaluation/grades', 'icon' => 'grade'],
                            ['title' => 'Pesquisas', 'slug' => '/educational/evaluation/research', 'icon' => 'science'],
                        ],
                    ],
                    [
                        'title' => 'Biblioteca',
                        'slug' => '/educational/library',
                        'icon' => 'auto_stories',
                        'children' => [
                            ['title' => 'Acervo', 'slug' => '/educational/library/books', 'icon' => 'auto_stories'],
                            ['title' => 'Empréstimos', 'slug' => '/educational/library/loans', 'icon' => 'assignment_return'],
                            ['title' => 'Reservas', 'slug' => '/educational/library/reservations', 'icon' => 'bookmark'],
                        ],
                    ],
                    [
                        'title' => 'Financeiro',
                        'slug' => '/educational/financial',
                        'icon' => 'account_balance_wallet',
                        'children' => [
                            ['title' => 'Planos de Pagamento', 'slug' => '/educational/financial/payment-plans', 'icon' => 'request_quote'],
                            ['title' => 'Bolsas', 'slug' => '/educational/financial/scholarships', 'icon' => 'volunteer_activism'],
                            ['title' => 'Contratos', 'slug' => '/educational/financial/contracts', 'icon' => 'description'],
                        ],
                    ],
                ],
            ],
            'Financeiro' => [
                'icon' => 'account_balance_wallet',
                'items' => [
                    ['title' => 'Dashboard Financeiro', 'slug' => '/financial/dashboard', 'icon' => 'dashboard'],
                    [
                        'title' => 'Cadastros',
                        'slug' => '/financial/registers',
                        'icon' => 'list',
                        'children' => [
                            ['title' => 'Clientes', 'slug' => '/financial/registers/customers', 'icon' => 'person'],
                            ['title' => 'Fornecedores', 'slug' => '/financial/registers/suppliers', 'icon' => 'local_shipping'],
                            ['title' => 'Categorias', 'slug' => '/financial/registers/transaction-categories', 'icon' => 'label'],
                            ['title' => 'Centros de Custo', 'slug' => '/financial/registers/cost-centers', 'icon' => 'account_tree'],
                        ],
                    ],
                    ['title' => 'Transações', 'slug' => '/financial/transactions', 'icon' => 'receipt_long'],
                    ['title' => 'Contas a Pagar', 'slug' => '/financial/accounts-payable', 'icon' => 'arrow_upward'],
                    ['title' => 'Contas a Receber', 'slug' => '/financial/accounts-receivable', 'icon' => 'arrow_downward'],
                    ['title' => 'Contas Bancárias', 'slug' => '/financial/bank-accounts', 'icon' => 'account_balance'],
                    ['title' => 'Conciliação', 'slug' => '/financial/reconciliation', 'icon' => 'fact_check'],
                    ['title' => 'Transferências', 'slug' => '/financial/transfers', 'icon' => 'swap_horiz'],
                    [
                        'title' => 'Orçamento',
                        'slug' => '/financial/budget',
                        'icon' => 'pie_chart',
                        'children' => [
                            ['title' => 'Orçamentos', 'slug' => '/financial/budget/budgets', 'icon' => 'pie_chart'],
                            ['title' => 'Categorias Orçamentárias', 'slug' => '/financial/budget/budget-categories', 'icon' => 'category'],
                        ],
                    ],
                    ['title' => 'Boletos', 'slug' => '/financial/boletos', 'icon' => 'barcode'],
                    ['title' => 'Pix', 'slug' => '/financial/pix', 'icon' => 'qr_code'],
                    ['title' => 'Cartões', 'slug' => '/financial/cards', 'icon' => 'credit_card'],
                    ['title' => 'Relatórios Financeiros', 'slug' => '/financial/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Igreja' => [
                'icon' => 'church',
                'items' => [
                    ['title' => 'Dashboard da Igreja', 'slug' => '/church/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Igrejas', 'slug' => '/church/churches', 'icon' => 'account_balance'],
                    ['title' => 'Congregações', 'slug' => '/church/congregations', 'icon' => 'groups'],
                    ['title' => 'Membros', 'slug' => '/church/members', 'icon' => 'group'],
                    ['title' => 'Famílias', 'slug' => '/church/families', 'icon' => 'family_restroom'],
                    ['title' => 'Departamentos', 'slug' => '/church/departments', 'icon' => 'apartment'],
                    ['title' => 'Ministérios', 'slug' => '/church/ministries', 'icon' => 'volunteer_activism'],
                    ['title' => 'Pequenos Grupos', 'slug' => '/church/groups', 'icon' => 'diversity_3'],
                    ['title' => 'Eventos', 'slug' => '/church/events', 'icon' => 'event'],
                    ['title' => 'Relatórios da Igreja', 'slug' => '/church/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Recursos Humanos' => [
                'icon' => 'badge',
                'items' => [
                    ['title' => 'Dashboard RH', 'slug' => '/hr/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Colaboradores', 'slug' => '/hr/employees', 'icon' => 'badge'],
                    ['title' => 'Departamentos', 'slug' => '/hr/departments', 'icon' => 'apartment'],
                    ['title' => 'Cargos', 'slug' => '/hr/positions', 'icon' => 'work'],
                    ['title' => 'Admissões', 'slug' => '/hr/admissions', 'icon' => 'person_add'],
                    ['title' => 'Demissões', 'slug' => '/hr/dismissals', 'icon' => 'person_remove'],
                    ['title' => 'Férias', 'slug' => '/hr/vacations', 'icon' => 'beach_access'],
                    ['title' => 'Benefícios', 'slug' => '/hr/benefits', 'icon' => 'redeem'],
                    ['title' => 'Folha de Pagamento', 'slug' => '/hr/payroll', 'icon' => 'payments'],
                    ['title' => 'Relatórios RH', 'slug' => '/hr/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Gestão de Projetos' => [
                'icon' => 'assignment',
                'items' => [
                    ['title' => 'Dashboard Projetos', 'slug' => '/projects/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Projetos', 'slug' => '/projects/projects', 'icon' => 'assignment'],
                    ['title' => 'Tarefas', 'slug' => '/projects/tasks', 'icon' => 'task_alt'],
                    ['title' => 'Equipes', 'slug' => '/projects/teams', 'icon' => 'diversity_3'],
                    ['title' => 'Apontamento de Horas', 'slug' => '/projects/time-tracking', 'icon' => 'schedule'],
                    ['title' => 'Relatórios de Projetos', 'slug' => '/projects/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Patrimônio' => [
                'icon' => 'inventory_2',
                'items' => [
                    ['title' => 'Dashboard Patrimônio', 'slug' => '/patrimony/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Bens', 'slug' => '/patrimony/assets', 'icon' => 'inventory_2'],
                    ['title' => 'Categorias', 'slug' => '/patrimony/categories', 'icon' => 'category'],
                    ['title' => 'Localizações', 'slug' => '/patrimony/locations', 'icon' => 'place'],
                    ['title' => 'Transferências', 'slug' => '/patrimony/transfers', 'icon' => 'swap_horiz'],
                    ['title' => 'Manutenção', 'slug' => '/patrimony/maintenance', 'icon' => 'build'],
                    ['title' => 'Depreciação', 'slug' => '/patrimony/depreciation', 'icon' => 'trending_down'],
                    ['title' => 'Relatórios de Patrimônio', 'slug' => '/patrimony/reports', 'icon' => 'bar_chart'],
                ],
            ],
            'Business Intelligence' => [
                'icon' => 'insights',
                'items' => [
                    ['title' => 'Dashboard BI', 'slug' => '/bi/dashboard', 'icon' => 'dashboard'],
                    ['title' => 'Indicadores', 'slug' => '/bi/indicators', 'icon' => 'speed'],
                    ['title' => 'Relatórios', 'slug' => '/bi/reports', 'icon' => 'bar_chart'],
                    ['title' => 'Analytics', 'slug' => '/bi/analytics', 'icon' => 'analytics'],
                ],
            ],
            'Configurações' => [
                'icon' => 'settings',
                'items' => [
                    ['title' => 'Organização', 'slug' => '/settings/organization', 'icon' => 'domain'],
                    ['title' => 'Minha Conta', 'slug' => '/settings/account', 'icon' => 'account_circle'],
                    ['title' => 'Usuários', 'slug' => '/settings/users', 'icon' => 'manage_accounts'],
                    ['title' => 'Perfis', 'slug' => '/settings/profiles', 'icon' => 'assignment_ind'],
                    ['title' => 'Permissões', 'slug' => '/settings/permissions', 'icon' => 'lock'],
                    ['title' => 'Módulos', 'slug' => '/settings/modules', 'icon' => 'extension'],
                    ['title' => 'Integrações', 'slug' => '/settings/integrations', 'icon' => 'sync_alt'],
                    ['title' => 'Notificações', 'slug' => '/settings/notifications', 'icon' => 'notifications'],
                    ['title' => 'Logs de Auditoria', 'slug' => '/settings/audit-logs', 'icon' => 'fact_check'],
                ],
            ],
        ];

        foreach ($categories as $category => $config) {
            $permission = PermissionDefinition::updateOrCreate(
                ['name' => 'menu.' . str($category)->slug('_')],
                [
                    'label' => "Acesso ao menu {$category}",
                    'description' => "Concede acesso às rotas da categoria {$category}.",
                ],
            );

            $sortOrder = 10;

            foreach ($config['items'] as $item) {
                $this->createRoute($item, $category, $permission, $sortOrder, null);
                $sortOrder += 10;
            }
        }

        MenuRoute::withTrashed()
            ->whereNotIn('slug', $this->seededSlugs)
            ->get()
            ->each(fn (MenuRoute $stale) => $stale->forceDelete());
    }

    private function createRoute(array $item, string $category, PermissionDefinition $permission, int $sortOrder, ?string $parentId): void
    {
        $this->seededSlugs[] = $item['slug'];

        $menuRoute = MenuRoute::updateOrCreate(
            ['slug' => $item['slug']],
            [
                'title' => $item['title'],
                'icon' => $item['icon'] ?? null,
                'category' => $category,
                'sort_order' => $sortOrder,
                'parent_id' => $parentId,
                'is_active' => true,
            ],
        );

        $menuRoute->permissions()->syncWithoutDetaching([$permission->id]);

        $childSortOrder = 10;

        foreach ($item['children'] ?? [] as $child) {
            $this->createRoute($child, $category, $permission, $childSortOrder, $menuRoute->id);
            $childSortOrder += 10;
        }
    }
}
