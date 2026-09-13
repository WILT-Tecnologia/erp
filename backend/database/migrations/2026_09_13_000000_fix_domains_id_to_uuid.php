<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class FixDomainsIdToUuid extends Migration
{
    /**
     * Converte a coluna `id` de `domains` de integer (auto-incremento herdado
     * da migration original do pacote stancl/tenancy) para uuid, alinhando
     * com o `use HasUuids;` do model App\Models\Central\Domain e com o
     * restante dos models "Central" (ex.: Organization).
     */
    public function up(): void
    {
        if ($this->idColumnAlreadyUuid()) {
            return;
        }

        Schema::table('domains', function (Blueprint $table) {
            $table->uuid('id_uuid')->nullable();
        });

        DB::table('domains')->orderBy('id')->select('id')->get()->each(function (object $row) {
            DB::table('domains')
                ->where('id', $row->id)
                ->update(['id_uuid' => (string) Str::orderedUuid()]);
        });

        Schema::table('domains', function (Blueprint $table) {
            $table->dropPrimary('domains_pkey');
            $table->dropColumn('id');
        });

        Schema::table('domains', function (Blueprint $table) {
            $table->renameColumn('id_uuid', 'id');
        });

        DB::statement('ALTER TABLE domains ALTER COLUMN id SET NOT NULL');
        DB::statement('ALTER TABLE domains ADD PRIMARY KEY (id)');
        DB::statement('DROP SEQUENCE IF EXISTS domains_id_seq');
    }

    /**
     * Não há reversão segura: voltar para integer perderia a correspondência
     * com o restante do sistema (que já usa UUID) e não há garantia de que
     * os valores UUID gerados caibam num novo auto-incremento previsível.
     */
    public function down(): void
    {
        // Intencionalmente irreversível — ver docblock de up().
    }

    private function idColumnAlreadyUuid(): bool
    {
        $type = DB::selectOne(
            "select data_type from information_schema.columns where table_name = 'domains' and column_name = 'id'",
        );

        return $type?->data_type === 'uuid';
    }
}
