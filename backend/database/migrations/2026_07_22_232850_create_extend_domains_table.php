<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->boolean('is_primary')->default(false)->after('domain');
            $table->boolean('is_verified')->default(false)->after('is_primary');
            $table->string('verification_token', 64)->nullable()->after('is_verified');
            $table->timestamp('verified_at')->nullable()->after('verification_token');

            $table->index('is_primary');
            $table->index('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->dropIndex(['is_primary']);
            $table->dropIndex(['is_verified']);
            $table->dropColumn(['is_primary', 'is_verified', 'verification_token', 'verified_at']);
        });
    }
};
