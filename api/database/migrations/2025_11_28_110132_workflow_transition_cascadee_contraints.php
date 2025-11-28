<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // Supprimer les anciennes contraintes
    Schema::table('workflow_transitions', function (Blueprint $table) {
      $table->dropForeign(['from_status_id']);
      $table->dropForeign(['to_status_id']);
    });

    // Ajouter les nouvelles contraintes avec CASCADE
    Schema::table('workflow_transitions', function (Blueprint $table) {
      $table->foreign('from_status_id')
        ->references('id')
        ->on('statuses')
        ->onDelete('cascade');

      $table->foreign('to_status_id')
        ->references('id')
        ->on('statuses')
        ->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::table('workflow_transitions', function (Blueprint $table) {
      $table->dropForeign(['from_status_id']);
      $table->dropForeign(['to_status_id']);
    });

    Schema::table('workflow_transitions', function (Blueprint $table) {
      $table->foreign('from_status_id')
        ->references('id')
        ->on('statuses')
        ->onDelete('restrict');

      $table->foreign('to_status_id')
        ->references('id')
        ->on('statuses')
        ->onDelete('restrict');
    });
  }
};
