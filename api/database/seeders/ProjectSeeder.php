<?php

namespace Database\Seeders;

use App\Models\Ticketing\Project;
use App\Models\Auth\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $leadUser = User::first();

        $projects = [
            [
                'key' => 'DEMO',
                'name' => 'Projet de démonstration',
                'description' => 'Un projet exemple pour tester Jirafy',
                'lead_user_id' => $leadUser?->id,
            ],
            [
                'key' => 'WEB',
                'name' => 'Site Web Corporate',
                'description' => 'Refonte du site web de l\'entreprise',
                'lead_user_id' => $leadUser?->id,
            ],
        ];

        foreach ($projects as $projectData) {
            Project::create($projectData);
        }

        $this->command->info('Projects seeded successfully!');
    }
}
