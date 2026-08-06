<?php
namespace App\Http\Middleware;

use Closure;
use Stancl\Tenancy\Middleware\IdentificationMiddleware;
use App\Models\Central\Organization;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenancyByHeader extends IdentificationMiddleware
{
    public function handle($request, Closure $next): Response
    {
        $tenantId = $request->header('X-Tenant-Id');

        abort_if(! $tenantId, 400, 'Header X-Tenant-Id é obrigatório.');

        $tenant = Organization::find($tenantId);
        abort_if(! $tenant, 404, 'Tenant não encontrado.');

        tenancy()->initialize($tenant);

        return $next($request);
    }
}
