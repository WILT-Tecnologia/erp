<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Resources\Central\MenuRouteResource;
use App\Models\Central\MenuRoute;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MenuRouteController extends Controller
{
    /**
     * Árvore de rotas de menu ativas, consumida pela sidebar do tenant.
     *
     * `menu_routes`/`permission_definitions` são tabelas centrais e
     * compartilhadas por todas as organizações; forçamos a conexão `pgsql`
     * porque, dentro de uma rota de tenant, a conexão default já foi trocada
     * para o schema da organização (ver DatabaseTenancyBootstrapper).
     */
    public function tree(): AnonymousResourceCollection
    {
        $menuRoutes = MenuRoute::on('pgsql')
            ->active()
            ->roots()
            ->with(['permissions', 'children.permissions', 'children.children.permissions'])
            ->orderBy('sort_order')
            ->get();

        return MenuRouteResource::collection($menuRoutes);
    }
}
