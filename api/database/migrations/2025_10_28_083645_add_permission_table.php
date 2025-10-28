<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Ex: 'issue.update', 'workflow.transition'
            $table->string('entity'); // 'issue', 'project', 'workflow', 'team'
            $table->string('action'); // 'create', 'update', 'delete', 'transition', 'manage'
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['entity', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
