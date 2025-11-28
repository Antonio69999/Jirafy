<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('workflow_transition_history', function (Blueprint $table) {
      $table->id();
      $table->foreignId('issue_id')->constrained()->onDelete('cascade');
      $table->foreignId('transition_id')->nullable()->constrained('workflow_transitions')->onDelete('set null');
      $table->foreignId('from_status_id')->constrained('statuses');
      $table->foreignId('to_status_id')->constrained('statuses');
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->json('validation_data')->nullable();
      $table->json('executed_actions')->nullable();
      $table->timestamp('created_at');

      $table->index(['issue_id', 'created_at']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('workflow_transition_history');
  }
};
