<?php

namespace Database\Seeders\Central;

use App\Actions\Central\CreateOrganizationAction;
use App\Models\Central\Admin;
use App\Models\Central\Organization;
use App\Models\Central\Plan;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(CreateOrganizationAction $action): void
    {
        // Só em dev/local — provisionar schemas em produção via API
        if (app()->environment('production')) {
            return;
        }

        // CreateOrganizationAction provisiona o schema do tenant, então não
        // pode ser chamada de novo para um id/slug já existente.
        if (Organization::where('id', 'demo-igreja-central')->exists()) {
            return;
        }

        $plan = Plan::where('slug', 'pro')->first();
        $admin = Admin::where('email', 'admin@saas.local')->first();

        $action->execute([
            'id'             => 'demo-igreja-central',
            'name'           => 'Igreja Central Demo',
            'legal_name'     => 'Associação Igreja Central Demo',
            'slug'           => 'igreja-central',
            'cnpj'           => '12345678000190',
            'email'          => 'contato@igrejacentral.local',
            'status'         => 'active',
            'timezone'       => 'America/Sao_Paulo',
            'language'       => 'pt-BR',
            'plan_id'        => $plan?->id,
            'owner_admin_id' => $admin?->id,
        ]);
    }
}
