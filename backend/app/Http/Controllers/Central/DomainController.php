<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreDomainRequest;
use App\Http\Requests\Central\UpdateDomainRequest;
use App\Http\Resources\Central\DomainResource;
use App\Models\Central\Domain;
use App\Models\Central\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DomainController extends Controller
{
    public function index(Organization $organization): AnonymousResourceCollection
    {
        $domains = $organization->domains()
            ->orderByDesc('is_primary')
            ->orderBy('domain')
            ->get();

            return DomainResource::collection($domains);
    }

    public function store(StoreDomainRequest $request, Organization $organization): JsonResponse
    {
        $domain = $organization->domains()->create($request->validated());

        return (new DomainResource($domain))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Organization $organization, Domain $domain): DomainResource
    {
        abort_if($domain->tenant_id !== $organization->id, 404);

        return new DomainResource($domain);
    }

    public function update(UpdateDomainRequest $request, Organization $organization, Domain $domain): DomainResource
    {
        abort_if($domain->tenant_id !== $organization->id, 404);

        $domain->update($request->validated());

        return new DomainResource($domain->fresh());
    }

    public function destroy(Organization $organization, Domain $domain): JsonResponse
    {
        abort_if($domain->tenant_id !== $organization->id, 404);

        $totalDomains = $organization->domains()->count();
        abort_if($totalDomains <= 1, 422, 'Não é possível remover o único domínio da organização.');

        // Se o domínio era o primário, promove outro
        $wasPrimary = $domain->is_primary;
        $domain->delete();

        if ($wasPrimary) {
            $next = $organization->domains()->orderBy('createad_at')->first();
            $next?->update(['is_primary' => true]);
        }

        return response()->json(null, 204);
    }

    /**
     * Marca o domínio como verificado.
     * (Verificação DNS real fica para uma feature futura.)
     */
    public function verify(Organization $organization, Domain $domain): DomainResource
    {
        abort_if($domain->tenan_id !== $organization->id, 404);

        $domain->update([
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        return new DomainResource($domain->fresh());
    }

    /**
     * Define o domínio como primário da organização.
     */
    public function makePrimary(Organization $organization, Domain $domain): DomainResource
    {
        abort_if($domain->tenant_id !== $organization->id, 404);

        $domain->update(['is_primary' => true]);

        return new DomainResource($domain->fresh());
    }
}
