<?php
namespace Database\Factories\Central;

use App\Enums\OrganizationStatus;
use App\Models\Central\Organization;
use App\Models\Central\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrganizationFactory extends Factory
{
    protected $model = Organization::class;

    public function definition(): array
    {
        $name = 'Igreja ' . fake()->lastName() . ' ' . Str::upper(Str::random(4));
        $slug = Str::slug($name);

        return [
            'id'             => (string) Str::uuid(),
            'name'           => $name,
            'legal_name'     => 'Associação ' . $name,
            'slug'           => $slug,
            'cnpj'           => fake()->numerify('##############'),
            'email'          => fake()->companyEmail(),
            'phone'          => fake()->numerify('11########'),
            'whatsapp'       => fake()->numerify('119########'),
            'description'    => fake()->sentence(),
            'founded_at'     => fake()->dateTimeBetween('-50 years', '-1 year')->format('Y-m-d'),
            'status'         => OrganizationStatus::Active,
            'timezone'       => 'America/Sao_Paulo',
            'language'       => 'pt-BR',
            'plan_id'        => Plan::query()->inRandomOrder()->value('id'),
            'owner_admin_id' => null,
            'settings'       => null,
        ];
    }

    public function suspended(): static
    {
        return $this->state(fn () => ['status' => OrganizationStatus::Suspended]);
    }

    public function withoutPlan(): static
    {
        return $this->state(fn () => ['plan_id' => null]);
    }
}
