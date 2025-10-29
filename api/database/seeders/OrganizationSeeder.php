<?php

namespace Database\Seeders;

use App\Models\Organizations\Organization;
use App\Models\Auth\User;
use App\Models\Ticketing\Project;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des organisations
        $org1 = Organization::create([
            'slug' => 'acme-corp',
            'name' => 'ACME Corporation',
            'domain' => 'acme.com',
            'description' => 'Organisation cliente ACME',
            'is_active' => true,
        ]);

        $org2 = Organization::create([
            'slug' => 'globex',
            'name' => 'Globex Inc',
            'domain' => 'globex.com',
            'description' => 'Organisation cliente Globex',
            'is_active' => true,
        ]);

        // Créer des utilisateurs clients
        $customer1 = User::create([
            'name' => 'John Client',
            'email' => 'john@acme.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'organization_id' => $org1->id,
        ]);

        $customer2 = User::create([
            'name' => 'Jane Client',
            'email' => 'jane@globex.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'organization_id' => $org2->id,
        ]);

        // Associer des projets aux organisations
        $project = Project::first(); // Prendre un projet existant

        if ($project) {
            $org1->projects()->attach($project->id);
            $org2->projects()->attach($project->id);
        }

        $this->command->info('✓ Organizations seeded successfully!');
    }
}