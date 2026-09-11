<?php

namespace App\Http\Controllers\Central;

use App\Actions\Central\CreateOrganizationAction;
use App\Actions\Central\DeleteOrganizationAction;
use App\Enums\OrganizationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreOrganizationRequest;
use App\Http\Requests\Central\UpdateOrganizationRequest;
use App\Http\Resources\Central\OrganizationResource;
use App\Models\Central\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rules\Password;

class OrganizationController extends Controller
{
    /**
     * Lista paginada de organizações.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $organizations = Organization::query()
            ->with(['plan', 'ownerAdmin'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('plan_id'), fn ($q, $planId) => $q->where('plan_id', $planId))
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('legal_name', 'ilike', "%{$search}%")
                  ->orWhere('slug', 'ilike', "%{$search}%")
                  ->orWhere('cnpj', 'ilike', "%{$search}%");
            }))
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return OrganizationResource::collection($organizations);
    }

    /**
     * Verifica se um slug já está em uso.
     * Considera também organizações soft-deleted, espelhando a
     * regra unique:organizations,slug do StoreOrganizationRequest.
     */
    public function checkSlug(string $slug): JsonResponse
    {
        $validated = validator([
            'slug' => $slug,
        ], [
            'slug' => ['required', 'string', 'alpha_dash', 'max:255'],
        ]);

        if ($validated->fails()) {
            return response()->json(['available' => false]);
        }

        $available = ! Organization::where('slug', $slug)->exists();

        return response()->json(['available' => $available]);
    }

    /**
     * Cria uma nova organização e provisiona seu schema.
     */
    public function store(
        StoreOrganizationRequest $request,
        CreateOrganizationAction $action,
    ): JsonResponse {
        $organization = $action->execute($request->validated());

        return (new OrganizationResource(
            $organization->load(['plan', 'ownerAdmin', 'domains'])
        ))->response()->setStatusCode(201);
    }

    /**
     * Exibe uma organização específica.
     */
    public function show(Organization $organization): OrganizationResource
    {
        return new OrganizationResource(
            $organization->load(['plan', 'ownerAdmin', 'domains'])
        );
    }

    /**
     * Atualiza uma organização.
     */
    public function update(
        UpdateOrganizationRequest $request,
        Organization $organization,
    ): OrganizationResource {
        $organization->update($request->validated());

        return new OrganizationResource(
            $organization->fresh()->load(['plan', 'ownerAdmin', 'domains'])
        );
    }

    /**
     * Soft delete: suspende e marca como deletada.
     * O schema permanece no banco para auditoria.
     *
     * Bloqueado se houver congregações ou assinaturas ativas/em atraso
     * vinculadas — o admin precisa resolver essas dependências antes.
     */
    public function destroy(
        Organization $organization,
        DeleteOrganizationAction $action,
    ): JsonResponse {
        $congregations = $organization->congregations()->get(['congregations.id', 'congregations.name']);
        $subscriptions = $organization->subscriptions()
            ->whereIn('status', ['active', 'past_due', 'trialing'])
            ->get(['subscriptions.id', 'subscriptions.status']);

        if ($congregations->isNotEmpty() || $subscriptions->isNotEmpty()) {
            return response()->json([
                'message' => 'Esta organização possui congregações ou assinaturas vinculadas e não pode ser removida.',
                'congregations' => $congregations,
                'subscriptions' => $subscriptions,
            ], 422);
        }

        $action->softDelete($organization);

        return response()->json(null, 204);
    }

    /**
     * Suspende uma organização (ainda existe, mas bloqueada).
     */
    public function suspend(Organization $organization): OrganizationResource
    {
        $organization->update(['status' => OrganizationStatus::Suspended]);

        return new OrganizationResource($organization->fresh());
    }

    /**
     * Reativa uma organização suspensa.
     */
    public function activate(Organization $organization): OrganizationResource
    {
        $organization->update(['status' => OrganizationStatus::Active]);

        return new OrganizationResource($organization->fresh());
    }

    /**
     * Drop definitivo: remove o schema do Postgres.
     * Endpoint perigoso — exige confirmação explícita.
     */
    public function forceDelete(
        Request $request,
        Organization $organization,
        DeleteOrganizationAction $action,
    ): JsonResponse {
        $validator = validator($request->all(), [
            'password' => ['required', 'string', 'current_password:api-admin', Password::defaults()],
        ], [
            'password.required' => 'Informe sua senha.',
            'password.current_password' => 'Senha incorreta.',
            'password.min' => 'A senha deve ter entre 8 e 32 caracteres.',
            'password.max' => 'A senha deve ter entre 8 e 32 caracteres.',
            'password.mixed' => 'A senha deve conter letras maiúsculas e minúsculas.',
            'password.numbers' => 'A senha deve conter pelo menos um número.',
            'password.symbols' => 'A senha deve conter pelo menos um caractere especial.',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $action->forceDelete($organization);

        return response()->json(['message' => 'Organização e schema removidos permanentemente.']);
    }
}
