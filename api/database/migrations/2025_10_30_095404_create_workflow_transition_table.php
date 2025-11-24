<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('workflow_transitions', function (Blueprint $table) {
      $table->id();
      $table->foreignId('project_id')->constrained()->onDelete('cascade');
      $table->foreignId('from_status_id')->constrained('statuses')->onDelete('cascade');
      $table->foreignId('to_status_id')->constrained('statuses')->onDelete('cascade');
      $table->string('name');
      $table->text('description')->nullable();
      $table->timestamps();

      // Index pour performance
      $table->index(['project_id', 'from_status_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('workflow_transitions');
  }
};
