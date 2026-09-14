<?php

declare(strict_types=1);

namespace App\Tenancy;

use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\TenantDatabaseManagers\PostgreSQLSchemaManager as BasePostgreSQLSchemaManager;

/**
 * PostgreSQLSchemaManager idempotente: o drop do schema não falha quando o
 * schema não existe. Isso evita o erro 500 no force delete, já que o action
 * e o evento TenantDeleted podem tentar dropar o mesmo schema duas vezes.
 */
class PostgreSQLSchemaManager extends BasePostgreSQLSchemaManager
{
    public function deleteDatabase(TenantWithDatabase $tenant): bool
    {
        $name = $tenant->database()->getName();

        if ($name === null || ! $this->databaseExists($name)) {
            return true;
        }

        return parent::deleteDatabase($tenant);
    }
}
