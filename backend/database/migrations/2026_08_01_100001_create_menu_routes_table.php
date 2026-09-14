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
        Schema::create('menu_routes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 150);
            $table->string('slug', 255)->unique();
            $table->string('icon', 100)->nullable();
            $table->string('category', 150);
            $table->unsignedBigInteger('sort_order')->default(0);
            $table->foreignUuid('parent_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('category');
            $table->index('sort_order');
            $table->index('is_active');
        });

        Schema::table('menu_routes', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('menu_routes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_routes');
    }
};
