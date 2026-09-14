<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Central-schema counterpart of database/migrations/tenant/2026_05_28_013129_create_activity_log_table.php.
        // Plain string morph columns (not the default bigint morphs, and not
        // nullableUuidMorphs either): Admin.id is a real Postgres `uuid`
        // column, but Organization.id is declared as a plain `string`
        // column and isn't guaranteed to be UUID-formatted (e.g. seeded
        // demo rows use human-readable ids) — a strict `uuid` column would
        // reject those at insert time.
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id();
            $table->string('log_name')->nullable()->index();
            $table->text('description');
            $table->string('subject_type')->nullable();
            $table->string('subject_id')->nullable();
            $table->index(['subject_type', 'subject_id'], 'subject_index');
            $table->string('event')->nullable();
            $table->string('causer_type')->nullable();
            $table->string('causer_id')->nullable();
            $table->index(['causer_type', 'causer_id'], 'causer_index');
            $table->json('attribute_changes')->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};
