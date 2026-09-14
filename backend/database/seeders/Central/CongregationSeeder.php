<?php

namespace Database\Seeders\Central;

use App\Models\Central\Congregation;
use App\Models\Central\Organization;
use Illuminate\Database\Seeder;

class CongregationSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            return;
        }

        foreach (Organization::all() as $organization) {
            $names = ["Sede {$organization->name}", "Congregação Norte", "Congregação Sul"];

            foreach (array_slice($names, 0, random_int(1, 3)) as $name) {
                Congregation::updateOrCreate(
                    ['organization_id' => $organization->id, 'name' => $name],
                    ['status' => 'active'],
                );
            }
        }
    }
}
