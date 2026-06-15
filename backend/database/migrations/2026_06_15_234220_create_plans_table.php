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
        Schema::create('plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 255)->unique();
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->decimal('price_monthly', 15,2);
            $table->decimal('price_yearly', 15, 2);
            $table->unsignedBigInteger('trial_days')->default(0);
            $table->unsignedBigInteger('max_users');
            $table->unsignedBigInteger('max_members');
            $table->unsignedBigInteger('max_storage_gb');
            $table->jsonb('features')->nullable();
            $table->boolean('is_public')->default(true);
            $table->unsignedBigInteger('sort_order')->default(0);
            $table->string('status', 50)->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index(['is_public', 'status']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
