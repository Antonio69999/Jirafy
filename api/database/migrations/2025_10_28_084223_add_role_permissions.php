<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role'); // 'admin', 'manager', 'contributor', 'viewer'
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->string('context'); // 'global', 'team', 'project'
            $table->timestamps();

            $table->unique(['role', 'permission_id', 'context']);
            $table->index(['role', 'context']);
        });

        // Contrainte CHECK pour PostgreSQL (optionnel mais propre)
        DB::statement("
            ALTER TABLE role_permissions
            ADD CONSTRAINT role_permissions_role_check
            CHECK (role IN ('admin', 'manager', 'contributor', 'viewer'))
        ");

        DB::statement("
            ALTER TABLE role_permissions
            ADD CONSTRAINT role_permissions_context_check
            CHECK (context IN ('global', 'team', 'project'))
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
