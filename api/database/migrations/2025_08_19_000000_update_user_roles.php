<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('password');
            $table->string('reset_token')->nullable()->after('role');
            $table->timestamp('reset_token_expires_at')->nullable()->after('reset_token');
        });

        // Ajouter la contrainte CHECK pour PostgreSQL
        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('super_admin','admin','user','customer'))
        ");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'reset_token', 'reset_token_expires_at']);
        });
    }
};
