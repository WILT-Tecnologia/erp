<?php

namespace Database\Factories\Central;

use App\Models\Central\Domain;
use App\Models\Central\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Domain>
 */
class DomainFactory extends Factory
{
    protected $model = Domain::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'tenant_id' => Organization::factory(),
            'domain' => Str::random(10) . '.test',
            'is_primary' => false,
            'is_verified' => false,
            'verification_token' => Str::random(48),
        ];
    }

    public function primary(): static
    {
        return $this->state(fn () => ['is_primary' => true]);
    }

    public function verified(): static
    {
        return $this->state(fn () => [
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }
}
