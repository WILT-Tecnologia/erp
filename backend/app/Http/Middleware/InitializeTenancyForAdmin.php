<?php

namespace App\Http\Middleware;

use App\Models\Central\Organization;
use App\Support\Audit\AuditLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets an authenticated super admin (api-admin guard) enter a specific
 * Organization's tenant schema. The organization is resolved only from the
 * already-authorized route segment, never from a client-supplied header —
 * a bogus/foreign X-Tenant-Id must have no effect on which schema is used.
 */
class InitializeTenancyForAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $admin = $request->user('api-admin');

        abort_unless($admin, 401);
        abort_unless($admin->is_super_admin, 403, 'Apenas super administradores podem acessar dados de uma organização.');

        $organization = $request->route('organization');

        if (! $organization instanceof Organization) {
            $organization = Organization::where('slug', $organization)->firstOrFail();
        }

        AuditLogger::logAdminTenantAccess($admin, $organization, $request);

        tenancy()->initialize($organization);

        $request->attributes->set('tenant_organization', $organization);

        return $next($request);
    }
}
