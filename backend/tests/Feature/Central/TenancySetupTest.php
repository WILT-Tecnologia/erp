<?php

use Illuminate\Support\Facades\DB;

it('cria um tenant e provisiona o schema no Postgres', function () {
    $tenant = createTenant();

    $schemas = DB::connection('pgsql')
        ->select("SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?", [
            'tenant_' . $tenant->id,
        ]);

    expect($schemas)->not->toBeEmpty();

    endTenancy();
});
