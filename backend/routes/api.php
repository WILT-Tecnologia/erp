<?php

use App\Http\Controllers\Central\AdminController;
use App\Http\Controllers\Central\AuthController;
use Illuminate\Support\Facades\Route;

// API Central - prefixo /api/admin
Route::prefix('admin')->group(function () {

    // Públicas
    Route::post('login', [AuthController::class, 'login']);

    // Protegidas
    Route::middleware('auth:api-admin')->group(function () {
        Route::get('me', [AuthController::class,'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        Route::apiResource('admins', AdminController::class);
    });
});
