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
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_status_id')->constrained('statuses')->cascadeOnDelete();
            $table->foreignId('to_status_id')->constrained('statuses')->cascadeOnDelete();
            $table->string('name', 100)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            // Une transition unique par projet
            $table->unique(['project_id', 'from_status_id', 'to_status_id'], 'unique_transition');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_transitions');
    }
};
