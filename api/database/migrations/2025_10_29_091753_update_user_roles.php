<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modifier la contrainte CHECK
        DB::statement("
            ALTER TABLE users 
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('super_admin','admin','user','customer'))
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE users 
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('super_admin','admin','user'))
        ");
    }
};
