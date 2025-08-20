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
        Schema::create('team_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('role', 20)->default('member'); // owner|admin|member|viewer
            $table->timestamps();

            $table->unique(['team_id', 'user_id']);
            $table->index(['team_id', 'role']);
        });

        // Optionnel mais propre (PostgreSQL) : contrainte CHECK sur le rôle
        DB::statement("
            ALTER TABLE team_users
            ADD CONSTRAINT team_users_role_check
            CHECK (role IN ('owner','admin','member','viewer'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_users');
    }
};
