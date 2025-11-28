<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('workflow_transitions', function (Blueprint $table) {
      // Conditions : règles pour autoriser la transition
      $table->json('conditions')->nullable()->after('description');

      // Validations : champs requis pour effectuer la transition
      $table->json('validators')->nullable()->after('conditions');

      // Actions post-transition
      $table->json('post_actions')->nullable()->after('validators');

      // Permissions spécifiques à la transition
      $table->json('allowed_roles')->nullable()->after('post_actions');
    });
  }

  public function down(): void
  {
    Schema::table('workflow_transitions', function (Blueprint $table) {
      $table->dropColumn(['conditions', 'validators', 'post_actions', 'allowed_roles']);
    });
  }
};
