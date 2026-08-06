<?php

namespace Database\Seeders\Central;

use App\Models\Central\MenuRoute;
use App\Models\Central\PermissionDefinition;
use Illuminate\Database\Seeder;

class MenuRouteSeeder extends Seeder
{
    /**
     * Árvore de exemplo do backlog: título, slug, ícone (nome lucide-react) e filhos.
     * Cada categoria ganha uma permissão de acesso própria, herdada por todas as
     * rotas/sub-rotas daquela categoria.
     */
    public function run(): void
    {
        $categories = [
            'Sistema' => [
                'icon' => 'layout-dashboard',
                'items' => [
                    ['title' => 'Dashboard', 'slug' => '/dashboard', 'icon' => 'layout-dashboard'],
                    ['title' => 'Organizações', 'slug' => '/organizations', 'icon' => 'building-2'],
                    ['title' => 'Administradores', 'slug' => '/admins', 'icon' => 'user-cog'],
                    ['title' => 'Planos', 'slug' => '/plans', 'icon' => 'credit-card'],
                ],
            ],
            'Administração' => [
                'icon' => 'shield-check',
                'items' => [
                    ['title' => 'Início', 'slug' => '/admin/home', 'icon' => 'home'],
                    ['title' => 'Dashboard', 'slug' => '/admin/dashboard', 'icon' => 'layout-dashboard'],
                    ['title' => 'Clientes', 'slug' => '/admin/clients', 'icon' => 'building-2'],
                    ['title' => 'Sistemas', 'slug' => '/admin/systems', 'icon' => 'cpu'],
                ],
            ],
            'Educacional' => [
                'icon' => 'graduation-cap',
                'items' => [
                    [
                        'title' => 'Alunos/Professores',
                        'slug' => '/educational/students-teachers',
                        'icon' => 'users',
                        'children' => [
                            ['title' => 'Alunos', 'slug' => '/educational/students-teachers/students', 'icon' => 'user'],
                            ['title' => 'Professores', 'slug' => '/educational/students-teachers/teachers', 'icon' => 'user-cog'],
                        ],
                    ],
                    [
                        'title' => 'Estrutura Curricular',
                        'slug' => '/educational/curriculum-structure',
                        'icon' => 'book-open',
                        'children' => [
                            ['title' => 'Cursos', 'slug' => '/educational/curriculum-structure/courses', 'icon' => 'book-marked'],
                            ['title' => 'Matrizes Curriculares', 'slug' => '/educational/curriculum-structure/curriculum-matrices', 'icon' => 'grid-3x3'],
                            ['title' => 'Estruturas Curriculares', 'slug' => '/educational/curriculum-structure/curriculum-structures', 'icon' => 'layers'],
                            ['title' => 'Disciplinas', 'slug' => '/educational/curriculum-structure/subjects', 'icon' => 'book'],
                        ],
                    ],
                    [
                        'title' => 'Ofertas',
                        'slug' => '/educational/offers',
                        'icon' => 'calendar-range',
                        'children' => [
                            ['title' => 'Período Acadêmico', 'slug' => '/educational/offers/academic-period', 'icon' => 'calendar-days'],
                            ['title' => 'Turmas', 'slug' => '/educational/offers/classes', 'icon' => 'users-2'],
                        ],
                    ],
                    [
                        'title' => 'Matrículas e Avaliação',
                        'slug' => '/educational/registration-evaluation',
                        'icon' => 'clipboard-check',
                        'children' => [
                            ['title' => 'Matrículas', 'slug' => '/educational/registration-evaluation/enrrolments', 'icon' => 'file-signature'],
                            ['title' => 'Renovação de Matrículas', 'slug' => '/educational/registration-evaluation/re-enrrolments', 'icon' => 'refresh-cw'],
                        ],
                    ],
                    [
                        'title' => 'Financeiro / Contábil',
                        'slug' => '/educational/financial-accounting',
                        'icon' => 'wallet',
                        'children' => [
                            ['title' => 'Planos de Pagamento', 'slug' => '/educational/financial-accounting/payment-plans', 'icon' => 'credit-card'],
                            ['title' => 'Bolsas', 'slug' => '/educational/financial-accounting/scholarships', 'icon' => 'award'],
                            ['title' => 'Contratos', 'slug' => '/educational/financial-accounting/contracts', 'icon' => 'file-text'],
                        ],
                    ],
                ],
            ],
            'Igreja' => ['icon' => 'church', 'items' => []],
            'Recursos Humanos' => ['icon' => 'contact', 'items' => []],
            'CRM' => [
                'icon' => 'handshake',
                'items' => [
                    ['title' => 'Pipeline CRM', 'slug' => '/crm', 'icon' => 'target'],
                ],
            ],
            'Gestão de Projetos' => [
                'icon' => 'folder-kanban',
                'items' => [
                    ['title' => 'Projetos', 'slug' => '/projects/project', 'icon' => 'folder-kanban'],
                ],
            ],
            'Patrimônio' => ['icon' => 'package', 'items' => []],
            'Business Intelligence' => ['icon' => 'bar-chart-3', 'items' => []],
            'Gestão Financeira' => [
                'icon' => 'dollar-sign',
                'items' => [
                    ['title' => 'Dashboard', 'slug' => '/financial', 'icon' => 'layout-dashboard'],
                    [
                        'title' => 'Cadastros',
                        'slug' => '/financial/registers',
                        'icon' => 'folder-plus',
                        'children' => [
                            ['title' => 'Clientes/Fornecedores', 'slug' => '/financial/registers/clients-suppliers', 'icon' => 'users'],
                            ['title' => 'Categorias de Transações', 'slug' => '/financial/registers/transaction-categories', 'icon' => 'tags'],
                        ],
                    ],
                    [
                        'title' => 'Operações',
                        'slug' => '/financial/operations',
                        'icon' => 'arrow-left-right',
                        'children' => [
                            ['title' => 'Transações/Lançamentos', 'slug' => '/financial/transactions', 'icon' => 'receipt'],
                            ['title' => 'Contas a Pagar/Receber', 'slug' => '/financial/payable', 'icon' => 'file-clock'],
                            ['title' => 'Conciliação Bancária', 'slug' => '/financial/reconciliation', 'icon' => 'landmark'],
                            ['title' => 'Orçamento', 'slug' => '/financial/budget', 'icon' => 'piggy-bank'],
                            ['title' => 'Relatórios Financeiros', 'slug' => '/financial/reports', 'icon' => 'file-bar-chart'],
                            ['title' => 'Boletos', 'slug' => '/financial/boletos', 'icon' => 'barcode'],
                            ['title' => 'PIX', 'slug' => '/financial/pix', 'icon' => 'zap'],
                            ['title' => 'Cartões', 'slug' => '/financial/cards', 'icon' => 'credit-card'],
                        ],
                    ],
                ],
            ],
            'Serviços Globais' => [
                'icon' => 'globe',
                'items' => [
                    ['title' => 'Usuários', 'slug' => '/global-services/users', 'icon' => 'users'],
                    ['title' => 'Perfis', 'slug' => '/global-services/profiles', 'icon' => 'id-card'],
                    ['title' => 'Módulos', 'slug' => '/global-services/modules', 'icon' => 'blocks'],
                    ['title' => 'Rotas do Menu', 'slug' => '/global-services/menu-routes', 'icon' => 'route'],
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
    }

    private function createRoute(array $item, string $category, PermissionDefinition $permission, int $sortOrder, ?string $parentId): void
    {
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
