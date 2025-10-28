<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticketing\Label;
use App\Models\Ticketing\Project;

class LabelSeeder extends Seeder
{
    public function run(): void
    {
        // Labels globaux communs
        $globalLabels = [
            ['name' => 'bug', 'color' => '#ef4444', 'description' => 'Problème à corriger'],
            ['name' => 'feature', 'color' => '#22c55e', 'description' => 'Nouvelle fonctionnalité'],
            ['name' => 'enhancement', 'color' => '#3b82f6', 'description' => 'Amélioration'],
            ['name' => 'documentation', 'color' => '#f59e0b', 'description' => 'Documentation'],
            ['name' => 'urgent', 'color' => '#dc2626', 'description' => 'Urgent'],
            ['name' => 'help-wanted', 'color' => '#8b5cf6', 'description' => 'Besoin d\'aide'],
        ];

        foreach ($globalLabels as $labelData) {
            Label::create($labelData);
        }

        // Créer des labels spécifiques pour chaque projet
        $projects = Project::all();

        foreach ($projects as $project) {
            Label::create([
                'name' => 'backend',
                'color' => '#14b8a6',
                'description' => 'Backend work',
                'project_id' => $project->id,
            ]);

            Label::create([
                'name' => 'frontend',
                'color' => '#ec4899',
                'description' => 'Frontend work',
                'project_id' => $project->id,
            ]);
        }

        $this->command->info('✓ Labels seeded successfully!');
    }
}
