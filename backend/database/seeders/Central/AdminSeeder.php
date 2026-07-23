<?php
namespace Database\Seeders\Central;

use App\Enums\AdminStatus;
use App\Models\Central\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::updateOrCreate(
            ['email' => 'admin@saas.local'],
            [
                'name'              => 'Super Admin',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'status'            => AdminStatus::Active,
                'locale'            => 'pt-BR',
                'timezone'          => 'America/Sao_Paulo',
            ]
        );

        // Em ambientes não-produção, semeia mais admins (só na primeira vez,
        // pra não empilhar registros novos a cada re-execução do seeder)
        if (! app()->environment('production') && Admin::count() <= 1) {
            Admin::factory()->count(5)->create();
        }
    }
}
