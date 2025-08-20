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
       Schema::create('issues', function (Blueprint $table) {
    $table->id();

    $table->foreignId('project_id')->constrained()->cascadeOnDelete();

    $table->foreignId('type_id')->constrained('issue_types')->restrictOnDelete();
    $table->foreignId('status_id')->constrained('statuses')->restrictOnDelete();
    $table->foreignId('priority_id')->constrained('priorities')->restrictOnDelete();

    $table->foreignId('reporter_id')->constrained('users')->restrictOnDelete();
    $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();

    $table->foreignId('epic_id')->nullable()->constrained('issues')->nullOnDelete();
    $table->foreignId('parent_id')->nullable()->constrained('issues')->nullOnDelete();

    $table->unsignedInteger('number');         // séquence locale projet
    $table->string('issue_key', 50)->unique(); // OPS-123

    $table->string('title', 255);
    $table->text('description')->nullable();
    $table->decimal('story_points', 5, 2)->nullable();
    $table->date('due_date')->nullable();

    $table->timestamps();

    $table->unique(['project_id', 'number']);
    $table->index(['project_id', 'status_id']);
    $table->index('assignee_id');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
