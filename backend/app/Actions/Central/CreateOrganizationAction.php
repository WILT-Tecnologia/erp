<?php

namespace App\Actions\Central;

use App\Models\Central\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOrganizationAction
{
    /**
     * Cria uma organization, provisiona o schema do tenant e
     * (opcionalmente) cria o primeiro usuário interno da org.
     *
     * @param  array{
     *   name: string,
     *   slug: string,
     *   plan_id?: string|null,
     *   owner_admin_id?: string|null,
     *   domain?: string|null,
     *   first_user?: array{name: string, email: string, password: string}|null,
     *   ...
     * } $data
     */
    public function execute(array $data): Organization
    {
        $domain = $data['domain'] ?? null;
        unset($data['domain']);

        return DB::connection('pgsql')->transaction(function () use ($data, $domain) {
            $organization = Organization::create(array_merge(
                ['id' => (string) Str::uuid()],
                $data,
            ));

            // O stancl provisiona o schema e roda as migrations tenant
            // automaticamente via TenantCreated event. Aqui só garantimos
            // que aconteceu antes de continuarmos.
            $organization->refresh();

            // Toda organization precisa de um domínio resolvível para que o
            // login de usuários do tenant identifique o schema automaticamente
            // (InitializeTenancyByDomain). Se nenhum for informado, usamos o
            // slug sob o domínio base da plataforma.
            $organization->createDomain(
                $domain ?: $organization->slug . '.' . config('tenancy.base_domain')
            );

            // Cria o primeiro usuário do tenant, se informado
            if (! empty($data['first_user'])) {
                $organization->run(function () use ($data) {
                    \App\Models\Tenant\User::create([
                        'name' => $data['first_user']['name'],
                        'email' => $data['first_user']['email'],
                        'password' => $data['first_user']['password'],
                        'email_verified_at' => now(),
                        'status' => 'active',
                    ]);
                });
            }

            return $organization;
        });
    }
}
