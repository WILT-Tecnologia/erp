<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreMenuRouteRequest;
use App\Http\Requests\Central\UpdateMenuRouteRequest;
use App\Http\Resources\Central\MenuRouteResource;
use App\Models\Central\MenuRoute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class MenuRouteController extends Controller
{
    /**
     * Lista paginada e "flat" das rotas de menu (para a tabela do CRUD).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $menuRoutes = MenuRoute::query()
            ->with(['parent', 'permissions'])
            ->withCount('children')
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->when($request->has('is_active'), function ($q) use ($request) {
                $q->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
            })
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('slug', 'ilike', "%{$search}%")
                  ->orWhereHas('parent', fn ($q) => $q->where('title', 'ilike', "%{$search}%"));
            }))
            ->orderBy('category')
            ->orderBy('sort_order')
            ->paginate($perPage);

        return MenuRouteResource::collection($menuRoutes);
    }

    /**
     * Árvore de rotas ativas (raízes + filhos recursivos), consumida pela sidebar.
     */
    public function tree(): AnonymousResourceCollection
    {
        $menuRoutes = MenuRoute::query()
            ->active()
            ->roots()
            ->with(['permissions', 'children.permissions', 'children.children.permissions'])
            ->orderBy('sort_order')
            ->get();

        return MenuRouteResource::collection($menuRoutes);
    }

    /**
     * Cria uma nova rota de menu.
     */
    public function store(StoreMenuRouteRequest $request): MenuRouteResource
    {
        $menuRoute = DB::connection('pgsql')->transaction(function () use ($request) {
            $menuRoute = MenuRoute::create($request->safe()->except('permission_ids'));
            $menuRoute->permissions()->sync($request->validated('permission_ids'));

            return $menuRoute;
        });

        return new MenuRouteResource($menuRoute->load(['parent', 'permissions']));
    }

    /**
     * Exibe uma rota específica.
     */
    public function show(MenuRoute $menuRoute): MenuRouteResource
    {
        return new MenuRouteResource($menuRoute->load(['parent', 'children.permissions', 'permissions']));
    }

    /**
     * Atualiza uma rota de menu.
     */
    public function update(UpdateMenuRouteRequest $request, MenuRoute $menuRoute): MenuRouteResource
    {
        DB::connection('pgsql')->transaction(function () use ($request, $menuRoute) {
            $menuRoute->update($request->safe()->except('permission_ids'));

            if ($request->has('permission_ids')) {
                $menuRoute->permissions()->sync($request->validated('permission_ids'));
            }
        });

        return new MenuRouteResource($menuRoute->fresh(['parent', 'permissions']));
    }

    /**
     * Remove uma rota de menu.
     *
     * Bloqueado se existirem rotas-filhas vinculadas — o usuário precisa
     * remover ou mover os filhos antes de excluir o pai.
     */
    public function destroy(MenuRoute $menuRoute): JsonResponse
    {
        if ($menuRoute->children()->exists()) {
            return response()->json([
                'message' => 'Esta rota possui rotas-filhas vinculadas. Remova ou mova os filhos antes de excluir.',
                'children' => $menuRoute->children()->get(['id', 'title', 'slug']),
            ], 422);
        }

        $menuRoute->delete();

        return response()->json(null, 204);
    }
}
