<?php

namespace App\Support\Audit;

use App\Models\Central\Admin;
use App\Models\Central\Organization;
use Illuminate\Http\Request;

class AuditLogger
{
    /**
     * Records a super admin entering an Organization's tenant context.
     * Must be called before tenancy()->initialize() so the entry lands in
     * the central schema's activity_log, not the tenant's.
     */
    public static function logAdminTenantAccess(Admin $admin, Organization $organization, Request $request): void
    {
        activity('tenant-access')
            ->causedBy($admin)
            ->performedOn($organization)
            ->withProperties([
                'context' => 'Global',
                'actor_role' => 'super_admin',
                'actor_email' => $admin->email,
                'organization_id' => $organization->id,
                'organization_slug' => $organization->slug,
                'tenant_schema' => 'tenant_' . $organization->id,
                'ip' => $request->ip(),
                'route' => $request->path(),
                'method' => $request->method(),
            ])
            ->log("Super admin \"{$admin->name}\" acessou o contexto da organização \"{$organization->name}\".");
    }
}
