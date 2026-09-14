<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\LoginRequest;
use App\Http\Resources\Central\AdminResource;
use App\Models\Central\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Autentica um super admin e retorna um token Sanctum.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $admin = Admin::where('email', $request->email)->first();

        if(! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        if($admin->status->value !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Administrador inativo.'],
            ]);
        }

        $admin->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $token = $admin->createToken(
            name: $request->device_name ?? 'admin-default',
            abilities: ['admin:*'],
        )->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => new AdminResource($admin),
        ]);
    }

    /**
     * Retorna o admin autenticado.
     *
     * Envolve a resource em `response()->json()` (em vez de devolvê-la
     * direto do controller) para não acionar o auto-wrap padrão do Laravel
     * em `{"data": {...}}` — o frontend espera o mesmo formato não
     * envelopado que `login()` já devolve em `admin`.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json(new AdminResource($request->user()));
    }

    /**
     * Revoga o token atual.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado.']);
    }
}
