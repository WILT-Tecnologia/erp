<?php
namespace Database\Factories\Central;

use App\Enums\PlanStatus;
use App\Models\Central\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        $baseName = fake()->randomElement(['Básico', 'Pro', 'Premium', 'Enterprise']);
        $suffix = Str::upper(Str::random(5));
        $name = "{$baseName} {$suffix}";
        
        return [
            'id'             => Str::uuid()->toString(),
            'name'           => $name,
            'slug'           => Str::slug($name),
            'description'    => fake()->sentence(),
            'price_monthly'  => fake()->randomFloat(2, 29, 499),
            'price_yearly'   => fake()->randomFloat(2, 290, 4990),
            'trial_days'     => fake()->randomElement([0, 7, 14, 30]),
            'max_users'      => fake()->randomElement([5, 10, 25, 100]),
            'max_members'    => fake()->randomElement([100, 500, 2000, 10000]),
            'max_storage_gb' => fake()->randomElement([5, 25, 100, 500]),
            'features'       => fake()->randomElements(
                ['financial', 'members', 'events', 'departments', 'assets', 'reports', 'api_access', 'priority_support'],
                fake()->numberBetween(3, 6)
            ),
            'is_public'      => true,
            'sort_order'     => fake()->numberBetween(0, 100),
            'status'         => PlanStatus::Active,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => PlanStatus::Inactive]);
    }

    public function private(): static
    {
        return $this->state(fn () => ['is_public' => false]);
    }
}
