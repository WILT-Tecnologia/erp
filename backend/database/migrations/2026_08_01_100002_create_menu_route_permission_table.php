<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_route_permission', function (Blueprint $table) {
            $table->foreignUuid('menu_route_id')->constrained('menu_routes')->cascadeOnDelete();
            $table->foreignUuid('permission_definition_id')->constrained('permission_definitions')->cascadeOnDelete();

            $table->unique(['menu_route_id', 'permission_definition_id'], 'menu_route_permission_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_route_permission');
    }
};
