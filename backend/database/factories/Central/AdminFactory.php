<?php
namespace Database\Factories\Central;

use App\Enums\AdminStatus;
use App\Models\Central\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition(): array
    {
        return [
            'id'                => Str::uuid()->toString(),
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'phone'             => fake()->numerify('11#########'),
            'locale'            => 'pt-BR',
            'timezone'          => 'America/Sao_Paulo',
            'status'            => AdminStatus::Active,
            'settings'          => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => AdminStatus::Inactive]);
    }

    public function unverified(): static
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }
}
