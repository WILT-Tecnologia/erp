<?php

namespace Database\Seeders\Central;

use App\Models\Central\Organization;
use App\Models\Central\Plan;
use App\Models\Central\Subscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            return;
        }

        $fallbackPlan = Plan::query()->orderBy('sort_order')->first();

        foreach (Organization::all() as $organization) {
            $plan = $organization->plan ?? $fallbackPlan;

            if (! $plan) {
                continue;
            }

            $startedAt = Carbon::now()->subMonths(random_int(1, 6))->startOfMonth();

            Subscription::updateOrCreate(
                ['organization_id' => $organization->id, 'started_at' => $startedAt],
                [
                    'plan_id' => $plan->id,
                    'status' => 'active',
                    'amount' => $plan->price_monthly,
                    'current_period_start' => Carbon::now()->startOfMonth(),
                    'current_period_end' => Carbon::now()->endOfMonth(),
                ],
            );
        }

        // Alguns dados de churn/inadimplência para os KPIs do dashboard não ficarem zerados.
        $organizations = Organization::all();

        if ($organizations->isNotEmpty() && $fallbackPlan) {
            Subscription::updateOrCreate(
                ['organization_id' => $organizations->first()->id, 'status' => 'canceled'],
                [
                    'plan_id' => $fallbackPlan->id,
                    'amount' => $fallbackPlan->price_monthly,
                    'started_at' => Carbon::now()->subMonths(3),
                    'current_period_start' => Carbon::now()->startOfMonth(),
                    'current_period_end' => Carbon::now()->endOfMonth(),
                    'canceled_at' => Carbon::now()->subDays(5),
                ],
            );

            Subscription::updateOrCreate(
                ['organization_id' => $organizations->first()->id, 'status' => 'past_due'],
                [
                    'plan_id' => $fallbackPlan->id,
                    'amount' => $fallbackPlan->price_monthly,
                    'started_at' => Carbon::now()->subMonths(2),
                    'current_period_start' => Carbon::now()->startOfMonth(),
                    'current_period_end' => Carbon::now()->endOfMonth(),
                ],
            );
        }
    }
}
