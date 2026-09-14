<?php

use App\Http\Controllers\Central\AdminController;
use App\Http\Controllers\Central\AuthController;
use App\Http\Controllers\Central\ContactActivityController;
use App\Http\Controllers\Central\ContactController;
use App\Http\Controllers\Central\ContactTaskController;
use App\Http\Controllers\Central\DashboardController;
use App\Http\Controllers\Central\DomainController;
use App\Http\Controllers\Central\MenuRouteController;
use App\Http\Controllers\Central\OrganizationController;
use App\Http\Controllers\Central\PermissionDefinitionController;
use App\Http\Controllers\Central\PlanController;
use App\Http\Controllers\Central\PublicPlanController;
use App\Http\Controllers\Central\TenantAccessController;
use App\Http\Middleware\InitializeTenancyForAdmin;
use Illuminate\Support\Facades\Route;

// ────────────── PÚBLICAS ──────────────
Route::get('plans', [PublicPlanController::class, 'index']);
Route::get('plans/{plan:slug}', [PublicPlanController::class, 'show']);

// ────────────── API CENTRAL (admin) ──────────────
// API Central - prefixo /api/admin
Route::prefix('admin')->group(function () {

    // Públicas
    Route::post('login', [AuthController::class, 'login']);

    // Protegidas
    Route::middleware('auth:api-admin')->group(function () {
        Route::get('me', [AuthController::class,'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        Route::get('dashboard/stats', [DashboardController::class, 'stats']);

        Route::apiResource('admins', AdminController::class);
        Route::apiResource('plans', PlanController::class);

        Route::get('organizations/check-slug/{slug}', [OrganizationController::class, 'checkSlug']);
        Route::apiResource('organizations', OrganizationController::class);
        Route::post('organizations/{organization}/suspend', [OrganizationController::class, 'suspend']);
        Route::post('organizations/{organization}/activate', [OrganizationController::class, 'activate']);
        Route::delete('organizations/{organization}/force', [OrganizationController::class, 'forceDelete']);

        Route::prefix('organizations/{organization:slug}')->group(function () {
            Route::get('domains/check-domain/{domainName}', [DomainController::class, 'checkDomain']);
            Route::apiResource('domains', DomainController::class);
            Route::post('domains/{domain}/verify', [DomainController::class, 'verify']);
            Route::post('domains/{domain}/make-primary', [DomainController::class, 'makePrimary']);
        });

        Route::get('organizations/{organization}/subscriptions', [OrganizationController::class, 'subscriptions']);

        // Admin-to-tenant access: super admins entering a specific
        // organization's schema. Scaffold group — real tenant business
        // resources (churches, members, ...) get added under here later.
        Route::prefix('organizations/{organization}')
            ->middleware(InitializeTenancyForAdmin::class)
            ->group(function () {
                Route::get('tenant-context', [TenantAccessController::class, 'show']);
            });

        Route::apiResource('permission-definitions', PermissionDefinitionController::class);

        Route::get('menu-routes/tree', [MenuRouteController::class, 'tree']);
        Route::apiResource('menu-routes', MenuRouteController::class);

        Route::apiResource('contacts', ContactController::class);
        Route::post('contacts/{contact}/activities', [ContactActivityController::class, 'store']);
        Route::post('contacts/{contact}/tasks', [ContactTaskController::class, 'store']);
        Route::patch('contacts/{contact}/tasks/{task}', [ContactTaskController::class, 'update']);
    });
});
