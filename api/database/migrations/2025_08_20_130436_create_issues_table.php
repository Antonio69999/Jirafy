<?php
// filepath: api/database/migrations/2025_08_20_130436_create_issues_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('type_id')->constrained('issue_types');
            $table->foreignId('status_id')->constrained('statuses');
            $table->foreignId('priority_id')->constrained('priorities');
            $table->foreignId('reporter_id')->constrained('users');
            $table->foreignId('assignee_id')->nullable()->constrained('users');
            $table->foreignId('parent_id')->nullable()->constrained('issues')->onDelete('set null');
            $table->foreignId('epic_id')->nullable()->constrained('issues')->onDelete('set null');

            $table->integer('number')->nullable();
            $table->string('key')->unique();

            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('story_points', 5, 2)->nullable();
            $table->integer('original_estimate')->nullable();
            $table->integer('remaining_estimate')->nullable();
            $table->integer('time_spent')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->text('resolution')->nullable();
            $table->text('environment')->nullable();
            $table->timestamps();

            // Index
            $table->index(['project_id', 'number']);
            $table->index('assignee_id');
            $table->index('reporter_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
