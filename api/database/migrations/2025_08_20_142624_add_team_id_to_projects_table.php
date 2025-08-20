<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // nullable d’abord pour faciliter la migration; tu pourras passer NOT NULL plus tard
            $table->foreignId('team_id')->nullable()->after('id')
                  ->constrained('teams')->nullOnDelete();
            $table->index('team_id');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id'); // drop FK + colonne
        });
    }
};
