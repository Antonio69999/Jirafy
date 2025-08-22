<?php
// database/migrations/xxxx_xx_xx_xxxxxx_alter_projects_issue_seq_default.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Postgres: nécessite doctrine/dbal pour change()
            $table->unsignedInteger('issue_seq')->default(0)->change();
        });
    }
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedInteger('issue_seq')->nullable(false)->default(null)->change();
        });
    }
};
