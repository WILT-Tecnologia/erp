<?php

namespace Database\Seeders\Central;

use App\Enums\PlanStatus;
use App\Models\Central\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'           => 'Básico',
                'slug'           => 'basico',
                'description'    => 'Ideal para igrejas pequenas começando agora.',
                'price_monthly'  => 49.90,
                'price_yearly'   => 499.00,
                'trial_days'     => 14,
                'max_users'      => 5,
                'max_members'    => 200,
                'max_storage_gb' => 5,
                'features'       => ['members', 'events', 'departments'],
                'sort_order'     => 10,
            ],
            [
                'name'           => 'Pro',
                'slug'           => 'pro',
                'description'    => 'Para igrejas em crescimento, com módulo financeiro.',
                'price_monthly'  => 149.90,
                'price_yearly'   => 1499.00,
                'trial_days'     => 14,
                'max_users'      => 15,
                'max_members'    => 1000,
                'max_storage_gb' => 25,
                'features'       => ['members', 'events', 'departments', 'financial', 'reports'],
                'sort_order'     => 20,
            ],
            [
                'name'           => 'Premium',
                'slug'           => 'premium',
                'description'    => 'Solução completa com patrimônio e múltiplas congregações.',
                'price_monthly'  => 299.90,
                'price_yearly'   => 2999.00,
                'trial_days'     => 30,
                'max_users'      => 50,
                'max_members'    => 5000,
                'max_storage_gb' => 100,
                'features'       => ['members', 'events', 'departments', 'financial', 'assets', 'reports', 'api_access'],
                'sort_order'     => 30,
            ],
            [
                'name'           => 'Enterprise',
                'slug'           => 'enterprise',
                'description'    => 'Plano sob medida para grandes denominações.',
                'price_monthly'  => 999.90,
                'price_yearly'   => 9999.00,
                'trial_days'     => 30,
                'max_users'      => 9999,
                'max_members'    => 999999,
                'max_storage_gb' => 1000,
                'features'       => ['members', 'events', 'departments', 'financial', 'assets', 'reports', 'api_access', 'priority_support'],
                'is_public'      => false,
                'sort_order'     => 40,
            ],
        ];

        foreach ($plans as $data) {
            Plan::updateOrCreate(
                ['slug' => $data['slug']],
                array_merge(['status' => PlanStatus::Active, 'is_public' => true], $data),
            );
        }
    }
}
