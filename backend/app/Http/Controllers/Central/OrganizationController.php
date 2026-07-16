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

class OrganizationController extends Controller
{
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

    public function store(StoreOrganizationRequest $request, CreateOrganizationAction $action): JsonResponse
    {
        $data = $request->validated();

        // Domínio é gerenciado pela tabela domains do stancl, separado
        $domain = $data['domain'] ?? null;
        unset($data['domain']);

        $organization = $action->execute($data);

        if ($domain) {
            $organization->domains()->create(['domain' => $domain]);
        }

        return (new OrganizationResource(
            $organization->load(['plan', 'ownerAdmin', 'domains'])
        ))->response()->setStatusCode(201);
    }

    public function show(Organization $organization): OrganizationResource
    {
        return new OrganizationResource($organization->load(['plan', 'ownerAdmin', 'domains']));
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): OrganizationResource
    {
        $organization->update($request->validated());

        return new OrganizationResource($organization->fresh()->load(['plan', 'ownerAdmin', 'domains']));
    }

    public function destroy(Organization $organization, DeleteOrganizationAction $action): JsonResponse
    {
        $action->softDelete($organization);

        return response()->json(null, 204);
    }

    public function suspend(Organization $organization): OrganizationResource
    {
        $organization->update(['status' => OrganizationStatus::Suspended]);

        return new OrganizationResource($organization->fresh());
    }

    public function activate(Organization $organization): OrganizationResource
    {
        $organization->update(['status' => OrganizationStatus::Active]);

        return new OrganizationResource($organization->fresh());
    }

    public function forceDelete(Request $request, Organization $organization, DeleteOrganizationAction $action): JsonResponse
    {
        $request->validate(['confirmation' => ['required', 'string', 'in:' . $organization->slug],]);

        $action->forceDelete($organization);

        return response()->json(['message' => 'Organização e schema removidos permanentemente.']);
    }
}
