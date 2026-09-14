<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreAdminRequest;
use App\Http\Requests\Central\UpdateAdminRequest;
use App\Http\Resources\Central\AdminResource;
use App\Models\Central\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminController extends Controller
{
    /**
     * Lista paginada de super admins.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $admins = Admin::query()
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            }))
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return AdminResource::collection($admins);
    }

    /**
     * Cria um novo super admin.
     */
    public function store(StoreAdminRequest $request): AdminResource
    {
        $data = $request->validated();

        abort_if(
            array_key_exists('is_super_admin', $data) && ! $request->user()->is_super_admin,
            403,
            'Apenas super administradores podem conceder este privilégio.'
        );

        $admin = Admin::create($data);

        return new AdminResource($admin);
    }

    /**
     * Exibe um super admin específico.
     */
    public function show(Admin $admin): AdminResource
    {
        return new AdminResource($admin);
    }

    /**
     * Atualiza um super admin.
     */
    public function update(UpdateAdminRequest $request, Admin $admin): AdminResource
    {
        $data = $request->validated();

        abort_if(
            array_key_exists('is_super_admin', $data) && ! $request->user()->is_super_admin,
            403,
            'Apenas super administradores podem conceder este privilégio.'
        );

        $admin->update($data);

        return new AdminResource($admin->fresh());
    }

    /**
     * Soft delete de um super admin.
     */
    public function destroy(Admin $admin, Request $request): JsonResponse
    {
        // Não pemitir auto-exclusão
        abort_if($admin->id === $request->user()->id, 422, 'Não é possível excluir a si mesmo.');

        $admin->delete();

        return response()->json(null, 204);
    }
}
