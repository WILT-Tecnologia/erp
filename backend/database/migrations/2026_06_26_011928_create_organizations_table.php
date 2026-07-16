<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            // PK do tenant (também usado como nome do schema: tenant_<id>)
            $table->string('id')->primary();

            $table->string('name', 255);
            $table->string('legal_name', 255)->nullable();
            $table->string('slug', 255)->unique();
            $table->string('cnpj', 20)->nullable()->unique();
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('whatsapp', 20)->nullable();
            $table->string('logo', 500)->nullable();
            $table->string('cover_image', 500)->nullable();
            $table->text('description')->nullable();
            $table->date('founded_at')->nullable();
            $table->string('status', 50)->default('active');
            $table->string('timezone', 100)->default('America/Sao_Paulo');
            $table->string('language', 10)->default('pt-BR');

            $table->foreignUuid('plan_id')->nullable()->constrained('plans')->nullOnDelete();
            $table->foreignUuid('owner_admin_id')->nullable()->constrained('admins')->nullOnDelete();

            $table->jsonb('settings')->nullable();

            // Coluna obrigatória do stancl/tenancy para dados extras
            $table->jsonb('data')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('plan_id');
            $table->index('owner_admin_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
