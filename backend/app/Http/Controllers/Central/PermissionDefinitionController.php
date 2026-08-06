<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StorePermissionDefinitionRequest;
use App\Http\Requests\Central\UpdatePermissionDefinitionRequest;
use App\Http\Resources\Central\PermissionDefinitionResource;
use App\Models\Central\PermissionDefinition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionDefinitionController extends Controller
{
    /**
     * Lista paginada do catálogo de permissões (admin).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $permissionDefinitions = PermissionDefinition::query()
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('label', 'ilike', "%{$search}%");
            }))
            ->orderBy('name')
            ->paginate($perPage);

        return PermissionDefinitionResource::collection($permissionDefinitions);
    }

    /**
     * Cria uma nova permissão do catálogo.
     */
    public function store(StorePermissionDefinitionRequest $request): PermissionDefinitionResource
    {
        $permissionDefinition = PermissionDefinition::create($request->validated());

        return new PermissionDefinitionResource($permissionDefinition);
    }

    /**
     * Exibe uma permissão específica.
     */
    public function show(PermissionDefinition $permissionDefinition): PermissionDefinitionResource
    {
        return new PermissionDefinitionResource($permissionDefinition);
    }

    /**
     * Atualiza uma permissão do catálogo.
     */
    public function update(UpdatePermissionDefinitionRequest $request, PermissionDefinition $permissionDefinition): PermissionDefinitionResource
    {
        $permissionDefinition->update($request->validated());

        return new PermissionDefinitionResource($permissionDefinition->fresh());
    }

    /**
     * Remove uma permissão do catálogo.
     *
     * Bloqueado se ela ainda estiver vinculada a alguma rota de menu.
     */
    public function destroy(PermissionDefinition $permissionDefinition): JsonResponse
    {
        if ($permissionDefinition->menuRoutes()->exists()) {
            return response()->json([
                'message' => 'Esta permissão está vinculada a uma ou mais rotas do menu e não pode ser removida.',
                'menu_routes' => $permissionDefinition->menuRoutes()->pluck('title'),
            ], 422);
        }

        $permissionDefinition->delete();

        return response()->json(null, 204);
    }
}
