<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\AuthController;
use App\Http\Middleware\InitializeTenancyByHeader;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Estas rotas são carregadas com o middleware "api" e prefixo "api/tenant"
| (ver bootstrap/app.php). A identificação do tenant é feita pelo header
| "X-Tenant-Id" (InitializeTenancyByHeader), que inicializa a conexão com
| o schema/DB da organização antes de qualquer query.
|
*/

Route::middleware([InitializeTenancyByHeader::class])->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api-tenant')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});
