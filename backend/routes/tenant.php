<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\AuthController;
use App\Http\Controllers\Tenant\MenuRouteController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Estas rotas são carregadas com o middleware "api" e prefixo "api/tenant"
| (ver bootstrap/app.php). A identificação do tenant é feita pelo domínio
| da requisição (InitializeTenancyByDomain), que resolve a organization
| cujo domínio (tabela domains) bate com o Host da requisição e inicializa
| a conexão com o schema/DB correspondente antes de qualquer query — sem
| exigir que o cliente informe o tenant explicitamente.
|
*/

Route::middleware([InitializeTenancyByDomain::class])->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api-tenant')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('menu-routes/tree', [MenuRouteController::class, 'tree']);
    });
});
