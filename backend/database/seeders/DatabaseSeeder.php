<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            \Database\Seeders\Central\AdminSeeder::class,
            \Database\Seeders\Central\PlanSeeder::class,
            \Database\Seeders\Central\OrganizationSeeder::class,
            \Database\Seeders\Central\DomainSeeder::class,
            \Database\Seeders\Central\MenuRouteSeeder::class,
            \Database\Seeders\Central\CongregationSeeder::class,
            \Database\Seeders\Central\SubscriptionSeeder::class,
            \Database\Seeders\Central\ContactSeeder::class,
        ]);
    }
}
