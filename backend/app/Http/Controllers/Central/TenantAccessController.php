<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Resources\Central\OrganizationResource;
use App\Models\Central\Organization;
use App\Models\Tenant\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantAccessController extends Controller
{
    /**
     * Confirms a super admin's tenant-context switch and proves the DB
     * connection actually moved to the organization's schema.
     */
    public function show(Request $request): JsonResponse
    {
        /** @var Organization $organization */
        $organization = $request->attributes->get('tenant_organization');

        return response()->json([
            'organization' => new OrganizationResource($organization),
            'tenant_schema' => 'tenant_' . $organization->id,
            'tenant_users_count' => User::count(),
        ]);
    }
}
