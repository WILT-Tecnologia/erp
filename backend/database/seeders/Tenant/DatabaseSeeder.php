<?php

declare(strict_types=1);

namespace Database\Seeders\Tenant;

use App\Models\Central\PermissionDefinition;
use App\Models\Tenant\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Runs inside a tenant's own schema (default connection is already switched
 * to `tenant` by the time this executes — see TenancyServiceProvider /
 * config/tenancy.php `seeder_parameters`). Mirrors the central permission
 * catalogue (`permission_definitions`, central-only, shared by every
 * organization) into this tenant's own Spatie tables, and grants all of it
 * to a default "Administrator" role assigned to every existing user — this
 * preserves today's de-facto "everyone sees everything" behavior. Narrower
 * per-user roles are a future admin-UI concern, not handled here.
 */
class DatabaseSeeder extends Seeder
{
    private const GUARD = 'api-tenant';

    private const ADMIN_ROLE = 'Administrator';

    public function run(): void
    {
        $permissions = PermissionDefinition::on('pgsql')
            ->pluck('name')
            ->map(fn (string $name) => Permission::firstOrCreate(['name' => $name, 'guard_name' => self::GUARD]));

        $adminRole = Role::firstOrCreate(['name' => self::ADMIN_ROLE, 'guard_name' => self::GUARD]);
        $adminRole->syncPermissions($permissions);

        User::query()->each(function (User $user) use ($adminRole): void {
            if (! $user->hasRole($adminRole)) {
                $user->assignRole($adminRole);
            }
        });
    }
}
