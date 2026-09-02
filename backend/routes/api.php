<?php

use App\Http\Controllers\Central\AdminController;
use App\Http\Controllers\Central\AuthController;
use App\Http\Controllers\Central\DomainController;
use App\Http\Controllers\Central\OrganizationController;
use App\Http\Controllers\Central\PlanController;
use App\Http\Controllers\Central\PublicPlanController;
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

        Route::apiResource('admins', AdminController::class);
        Route::apiResource('plans', PlanController::class);

        Route::apiResource('organizations', OrganizationController::class);
        Route::post('organizations/{organization}/suspend', [OrganizationController::class, 'suspend']);
        Route::post('organizations/{organization}/activate', [OrganizationController::class, 'activate']);
        Route::delete('organizations/{organization}/force', [OrganizationController::class, 'forceDelete']);

        Route::prefix('organizations/{organization:slug}')->group(function () {
            Route::apiResource('domains', DomainController::class);
            Route::post('domains/{domain}/verify', [DomainController::class, 'verify']);
            Route::post('domains/{domain}/make-primary', [DomainController::class, 'makePrimary']);
        })
    });
});
