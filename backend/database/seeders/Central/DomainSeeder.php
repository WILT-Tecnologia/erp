<?php
namespace Database\Seeders\Central;

use App\Models\Central\Domain;
use App\Models\Central\Organization;
use Illuminate\Database\Seeder;

class DomainSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            return;
        }

        $org = Organization::where('slug', 'igreja-central')->first();

        if (! $org) {
            return;
        }

        Domain::updateOrCreate(
            ['domain' => 'igrejacentral.local'],
            [
                'tenant_id'   => $org->id,
                'is_primary'  => true,
                'is_verified' => true,
                'verified_at' => now(),
            ]
        );

        Domain::updateOrCreate(
            ['domain' => 'central.igreja.test'],
            [
                'tenant_id'  => $org->id,
                'is_primary' => false,
            ]
        );
    }
}
