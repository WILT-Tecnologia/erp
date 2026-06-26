<?php
namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StorePlanRequest;
use App\Http\Requests\Central\UpdatePlanRequest;
use App\Http\Resources\Central\PlanResource;
use App\Models\Central\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlanController extends Controller
{
    /**
     * Lista paginada de planos (admin).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $plans = Plan::query()
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('is_public'), function ($q, $isPublic) {
                $q->where('is_public', filter_var($isPublic, FILTER_VALIDATE_BOOLEAN));
            })
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('slug', 'ilike', "%{$search}%");
            }))
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return PlanResource::collection($plans);
    }

    /**
     * Cria um novo plano.
     */
    public function store(StorePlanRequest $request): PlanResource
    {
        $plan = Plan::create($request->validated());

        return new PlanResource($plan);
    }

    /**
     * Exibe um plano específico.
     */
    public function show(Plan $plan): PlanResource
    {
        return new PlanResource($plan);
    }

    /**
     * Atualiza um plano.
     */
    public function update(UpdatePlanRequest $request, Plan $plan): PlanResource
    {
        $plan->update($request->validated());

        return new PlanResource($plan->fresh());
    }

    /**
     * Soft delete de um plano.
     *
     * ⚠️ Bloqueado se houver subscriptions vinculadas (validação será adicionada
     * na Fase 1.5 quando a tabela subscriptions existir).
     */
    public function destroy(Plan $plan): JsonResponse
    {
        // TODO: na Fase 1.5, validar se há subscriptions ativas vinculadas
        $plan->delete();

        return response()->json(null, 204);
    }
}
