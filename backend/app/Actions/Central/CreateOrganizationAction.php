<?php

namespace App\Actions\Central;

use App\Models\Central\Organization;
use App\Models\Tenant\User;
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

        // ATENÇÃO: a criação do tenant NÃO pode rodar dentro de um
        // DB::transaction. O evento TenantCreated provisiona o schema e roda
        // as migrations em uma conexão nova; se o `CREATE SCHEMA` ficar numa
        // transação pendente, essa conexão não enxerga o schema e o migrate
        // falha com "no schema has been selected to create in".
        $organization = Organization::create(array_merge(
            ['id' => (string) Str::uuid()],
            $data,
        ));

        try {
            // Toda organization precisa de um domínio resolvível para que o
            // login de usuários do tenant identifique o schema automaticamente
            // (InitializeTenancyByDomain). Se nenhum for informado, usamos o
            // slug sob o domínio base da plataforma.
            $organization->createDomain(
                $domain ?: $organization->slug.'.'.config('tenancy.base_domain')
            );

            // Cria o primeiro usuário do tenant, se informado
            if (! empty($data['first_user'])) {
                $organization->run(function () use ($data) {
                    User::create([
                        'name' => $data['first_user']['name'],
                        'email' => $data['first_user']['email'],
                        'password' => $data['first_user']['password'],
                        'email_verified_at' => now(),
                        'status' => 'active',
                    ]);
                });
            }
        } catch (\Throwable $e) {
            // Remove o que foi provisionado até aqui. O forceDelete dispara o
            // TenantDeleted (DROP SCHEMA) pelo stancl; o schema pode nem ter
            // sido criado, então o cleanup nunca deve mascarar o erro real.
            try {
                $organization->forceDelete();
            } catch (\Throwable) {
                // ignora falhas do cleanup
            }

            throw $e;
        }

        return $organization;
    }
}
