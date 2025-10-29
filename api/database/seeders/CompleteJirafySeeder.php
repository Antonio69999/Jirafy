<?php
// filepath: api/database/seeders/CompleteJirafySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Auth\User;
use App\Models\Teams\Team;
use App\Models\Ticketing\{Project, Issue, Label, Status};
use App\Models\Organizations\Organization;
use Illuminate\Support\Facades\DB;

class CompleteJirafySeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🚀 Starting Complete Jirafy Seeding...');

        // 1. Permissions et métadonnées
        $this->call([
            PermissionSeeder::class,
            TicketingReferenceSeeder::class,
        ]);

        // 2. Utilisateurs (admin, users, customers)
        $this->seedUsers();

        // 3. Organisations
        $this->seedOrganizations();

        // 4. Équipes
        $this->seedTeams();

        // 5. Projets
        $this->seedProjects();

        // 6. Labels (globaux et par projet)
        $this->seedLabels();

        // 7. Issues (tickets)
        $this->seedIssues();

        $this->command->info('✅ Complete Jirafy Seeding completed successfully!');
    }

    private function seedUsers(): void
    {
        $this->command->info('📝 Seeding users...');

        // ==================== ADMINS ====================
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
        ]);

        $admin2 = User::create([
            'name' => 'Admin User',
            'email' => 'admin2@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        // ==================== UTILISATEURS INTERNES ====================
        $dev1 = User::create([
            'name' => 'Alice Developer',
            'email' => 'alice@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        $dev2 = User::create([
            'name' => 'Bob Backend',
            'email' => 'bob@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        $designer = User::create([
            'name' => 'Clara Designer',
            'email' => 'clara@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        $pm = User::create([
            'name' => 'David PM',
            'email' => 'david@jirafy.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        $this->command->info('✓ Internal users created');
    }

    private function seedOrganizations(): void
    {
        $this->command->info('📝 Seeding organizations...');

        // ==================== ORGANISATIONS CLIENTES ====================
        $acme = Organization::create([
            'slug' => 'acme-corp',
            'name' => 'ACME Corporation',
            'domain' => 'acme.com',
            'description' => 'Grande entreprise de technologie',
            'is_active' => true,
        ]);

        $globex = Organization::create([
            'slug' => 'globex',
            'name' => 'Globex Inc',
            'domain' => 'globex.com',
            'description' => 'Leader mondial de l\'industrie',
            'is_active' => true,
        ]);

        $initech = Organization::create([
            'slug' => 'initech',
            'name' => 'Initech',
            'domain' => 'initech.com',
            'description' => 'Entreprise de services IT',
            'is_active' => true,
        ]);

        // ==================== CLIENTS ====================
        $customer1 = User::create([
            'name' => 'John Client (ACME)',
            'email' => 'john@acme.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'customer',
            'organization_id' => $acme->id,
        ]);

        $customer2 = User::create([
            'name' => 'Jane Manager (ACME)',
            'email' => 'jane@acme.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'customer',
            'organization_id' => $acme->id,
        ]);

        $customer3 = User::create([
            'name' => 'Mike User (Globex)',
            'email' => 'mike@globex.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'customer',
            'organization_id' => $globex->id,
        ]);

        $customer4 = User::create([
            'name' => 'Sarah Tech (Initech)',
            'email' => 'sarah@initech.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'role' => 'customer',
            'organization_id' => $initech->id,
        ]);

        $this->command->info('✓ Organizations and customers created');
    }

    private function seedTeams(): void
    {
        $this->command->info('📝 Seeding teams...');

        $dev1 = User::where('email', 'alice@jirafy.com')->first();
        $dev2 = User::where('email', 'bob@jirafy.com')->first();
        $designer = User::where('email', 'clara@jirafy.com')->first();
        $pm = User::where('email', 'david@jirafy.com')->first();
        $admin = User::where('email', 'admin@jirafy.com')->first();

        // ==================== ÉQUIPE DÉVELOPPEMENT ====================
        $devTeam = Team::create([
            'slug' => 'dev-team',
            'name' => 'Équipe de Développement',
            'description' => 'Équipe responsable du développement logiciel',
        ]);

        $devTeam->members()->attach([
            $dev1->id => ['role' => 'owner'],
            $dev2->id => ['role' => 'admin'],
            $designer->id => ['role' => 'member'],
        ]);

        // ==================== ÉQUIPE DESIGN ====================
        $designTeam = Team::create([
            'slug' => 'design-team',
            'name' => 'Équipe Design',
            'description' => 'Équipe UX/UI',
        ]);

        $designTeam->members()->attach([
            $designer->id => ['role' => 'owner'],
            $dev1->id => ['role' => 'member'],
        ]);

        // ==================== ÉQUIPE PROJET ====================
        $projectTeam = Team::create([
            'slug' => 'project-team',
            'name' => 'Gestion de Projet',
            'description' => 'Équipe de pilotage et gestion de projet',
        ]);

        $projectTeam->members()->attach([
            $pm->id => ['role' => 'owner'],
            $admin->id => ['role' => 'admin'],
        ]);

        $this->command->info('✓ Teams created');
    }

    private function seedProjects(): void
    {
        $this->command->info('📝 Seeding projects...');

        $devTeam = Team::where('slug', 'dev-team')->first();
        $designTeam = Team::where('slug', 'design-team')->first();
        $projectTeam = Team::where('slug', 'project-team')->first();
        $dev1 = User::where('email', 'alice@jirafy.com')->first();
        $pm = User::where('email', 'david@jirafy.com')->first();
        $designer = User::where('email', 'clara@jirafy.com')->first();

        $acme = Organization::where('slug', 'acme-corp')->first();
        $globex = Organization::where('slug', 'globex')->first();
        $initech = Organization::where('slug', 'initech')->first();

        // ==================== PROJET 1 : Site Web ACME ====================
        $webProject = Project::create([
            'key' => 'WEB',
            'name' => 'Site Web ACME',
            'description' => 'Refonte complète du site corporate ACME',
            'team_id' => $devTeam->id,
            'lead_user_id' => $dev1->id,
        ]);

        // Associer à l'organisation ACME
        $acme->projects()->attach($webProject->id);

        // Associer les statuts disponibles
        $statuses = Status::all();
        foreach ($statuses as $index => $status) {
            DB::table('project_statuses')->insert([
                'project_id' => $webProject->id,
                'status_id' => $status->id,
                'position' => $index + 1,
                'is_default' => $status->key === 'TODO',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ==================== PROJET 2 : App Mobile Globex ====================
        $mobileProject = Project::create([
            'key' => 'MOB',
            'name' => 'Application Mobile Globex',
            'description' => 'Développement de l\'application mobile iOS/Android',
            'team_id' => $devTeam->id,
            'lead_user_id' => $pm->id,
        ]);

        $globex->projects()->attach($mobileProject->id);

        foreach ($statuses as $index => $status) {
            DB::table('project_statuses')->insert([
                'project_id' => $mobileProject->id,
                'status_id' => $status->id,
                'position' => $index + 1,
                'is_default' => $status->key === 'TODO',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ==================== PROJET 3 : Design System ====================
        $dsProject = Project::create([
            'key' => 'DS',
            'name' => 'Design System',
            'description' => 'Création du design system de l\'entreprise',
            'team_id' => $designTeam->id,
            'lead_user_id' => $designer->id,
        ]);

        // Projet interne (pas d'organisation cliente)

        foreach ($statuses as $index => $status) {
            DB::table('project_statuses')->insert([
                'project_id' => $dsProject->id,
                'status_id' => $status->id,
                'position' => $index + 1,
                'is_default' => $status->key === 'TODO',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ==================== PROJET 4 : Intranet Initech ====================
        $intranetProject = Project::create([
            'key' => 'INT',
            'name' => 'Intranet Initech',
            'description' => 'Plateforme intranet pour Initech',
            'team_id' => $projectTeam->id,
            'lead_user_id' => $pm->id,
        ]);

        $initech->projects()->attach($intranetProject->id);

        foreach ($statuses as $index => $status) {
            DB::table('project_statuses')->insert([
                'project_id' => $intranetProject->id,
                'status_id' => $status->id,
                'position' => $index + 1,
                'is_default' => $status->key === 'TODO',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✓ Projects created');
    }

    private function seedLabels(): void
    {
        $this->command->info('📝 Seeding labels...');

        // ==================== LABELS GLOBAUX ====================
        $globalLabels = [
            ['name' => 'bug', 'color' => '#ef4444', 'description' => 'Problème à corriger'],
            ['name' => 'feature', 'color' => '#22c55e', 'description' => 'Nouvelle fonctionnalité'],
            ['name' => 'enhancement', 'color' => '#3b82f6', 'description' => 'Amélioration'],
            ['name' => 'documentation', 'color' => '#f59e0b', 'description' => 'Documentation'],
            ['name' => 'urgent', 'color' => '#dc2626', 'description' => 'Urgent'],
            ['name' => 'help-wanted', 'color' => '#8b5cf6', 'description' => 'Besoin d\'aide'],
            ['name' => 'good-first-issue', 'color' => '#14b8a6', 'description' => 'Bon premier ticket'],
            ['name' => 'wontfix', 'color' => '#6b7280', 'description' => 'Ne sera pas corrigé'],
        ];

        foreach ($globalLabels as $labelData) {
            Label::create($labelData);
        }

        // ==================== LABELS PAR PROJET ====================
        $projects = Project::all();

        foreach ($projects as $project) {
            // Labels spécifiques selon le type de projet
            if ($project->key === 'WEB') {
                Label::create([
                    'name' => 'frontend',
                    'color' => '#ec4899',
                    'description' => 'Interface utilisateur',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'backend',
                    'color' => '#14b8a6',
                    'description' => 'Logique serveur',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'SEO',
                    'color' => '#f97316',
                    'description' => 'Optimisation SEO',
                    'project_id' => $project->id,
                ]);
            } elseif ($project->key === 'MOB') {
                Label::create([
                    'name' => 'ios',
                    'color' => '#3b82f6',
                    'description' => 'iOS spécifique',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'android',
                    'color' => '#22c55e',
                    'description' => 'Android spécifique',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'api',
                    'color' => '#8b5cf6',
                    'description' => 'API REST',
                    'project_id' => $project->id,
                ]);
            } elseif ($project->key === 'DS') {
                Label::create([
                    'name' => 'component',
                    'color' => '#ec4899',
                    'description' => 'Composant UI',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'token',
                    'color' => '#f59e0b',
                    'description' => 'Design token',
                    'project_id' => $project->id,
                ]);
            } else {
                Label::create([
                    'name' => 'backend',
                    'color' => '#14b8a6',
                    'description' => 'Backend',
                    'project_id' => $project->id,
                ]);
                Label::create([
                    'name' => 'frontend',
                    'color' => '#ec4899',
                    'description' => 'Frontend',
                    'project_id' => $project->id,
                ]);
            }
        }

        $this->command->info('✓ Labels created');
    }

    private function seedIssues(): void
    {
        $this->command->info('📝 Seeding issues...');

        $webProject = Project::where('key', 'WEB')->first();
        $mobileProject = Project::where('key', 'MOB')->first();
        $dsProject = Project::where('key', 'DS')->first();

        $dev1 = User::where('email', 'alice@jirafy.com')->first();
        $dev2 = User::where('email', 'bob@jirafy.com')->first();
        $designer = User::where('email', 'clara@jirafy.com')->first();
        $customer = User::where('email', 'john@acme.com')->first();

        $typeTask = DB::table('issue_types')->where('key', 'TASK')->first();
        $typeBug = DB::table('issue_types')->where('key', 'BUG')->first();
        $typeStory = DB::table('issue_types')->where('key', 'STORY')->first();

        $statusTodo = Status::where('key', 'TODO')->first();
        $statusInProgress = Status::where('key', 'IN_PROGRESS')->first();
        $statusDone = Status::where('key', 'DONE')->first();

        $priorityHigh = DB::table('priorities')->where('key', 'HIGH')->first();
        $priorityMedium = DB::table('priorities')->where('key', 'MEDIUM')->first();
        $priorityLow = DB::table('priorities')->where('key', 'LOW')->first();

        // ==================== ISSUES PROJET WEB ====================
        $issue1 = Issue::create([
            'project_id' => $webProject->id,
            'type_id' => $typeTask->id,
            'status_id' => $statusInProgress->id,
            'priority_id' => $priorityHigh->id,
            'reporter_id' => $customer->id,
            'assignee_id' => $dev1->id,
            'title' => 'Créer la page d\'accueil responsive',
            'description' => 'Développer une page d\'accueil moderne et responsive avec animations',
            'story_points' => 8,
            'due_date' => now()->addDays(7),
        ]);

        $issue2 = Issue::create([
            'project_id' => $webProject->id,
            'type_id' => $typeBug->id,
            'status_id' => $statusTodo->id,
            'priority_id' => $priorityHigh->id,
            'reporter_id' => $dev2->id,
            'assignee_id' => $dev1->id,
            'title' => 'Corriger le bug du menu mobile',
            'description' => 'Le menu hamburger ne s\'ouvre pas correctement sur iOS',
            'due_date' => now()->addDays(2),
        ]);

        $issue3 = Issue::create([
            'project_id' => $webProject->id,
            'type_id' => $typeStory->id,
            'status_id' => $statusDone->id,
            'priority_id' => $priorityMedium->id,
            'reporter_id' => $customer->id,
            'assignee_id' => $designer->id,
            'title' => 'Design du système de navigation',
            'description' => 'Concevoir le système de navigation principale du site',
            'story_points' => 5,
        ]);

        // ==================== ISSUES PROJET MOBILE ====================
        Issue::create([
            'project_id' => $mobileProject->id,
            'type_id' => $typeTask->id,
            'status_id' => $statusTodo->id,
            'priority_id' => $priorityMedium->id,
            'reporter_id' => $dev1->id,
            'assignee_id' => $dev2->id,
            'title' => 'Implémenter l\'authentification biométrique',
            'description' => 'Ajouter Touch ID et Face ID pour iOS',
            'story_points' => 13,
        ]);

        Issue::create([
            'project_id' => $mobileProject->id,
            'type_id' => $typeBug->id,
            'status_id' => $statusInProgress->id,
            'priority_id' => $priorityHigh->id,
            'reporter_id' => $customer->id,
            'assignee_id' => $dev2->id,
            'title' => 'Crash au démarrage sur Android 12',
            'description' => 'L\'application plante au démarrage sur les appareils Android 12',
            'due_date' => now()->addDay(),
        ]);

        // ==================== ISSUES DESIGN SYSTEM ====================
        Issue::create([
            'project_id' => $dsProject->id,
            'type_id' => $typeTask->id,
            'status_id' => $statusTodo->id,
            'priority_id' => $priorityLow->id,
            'reporter_id' => $designer->id,
            'assignee_id' => $designer->id,
            'title' => 'Documenter les composants Button',
            'description' => 'Créer la documentation Storybook pour le composant Button',
            'story_points' => 3,
        ]);

        // Attacher des labels aux issues
        $bugLabel = Label::where('name', 'bug')->whereNull('project_id')->first();
        $frontendLabel = Label::where('name', 'frontend')->where('project_id', $webProject->id)->first();
        $urgentLabel = Label::where('name', 'urgent')->whereNull('project_id')->first();

        if ($bugLabel && $issue2) {
            $issue2->labels()->attach($bugLabel->id);
        }
        if ($frontendLabel && $issue1) {
            $issue1->labels()->attach($frontendLabel->id);
        }
        if ($urgentLabel && $issue2) {
            $issue2->labels()->attach($urgentLabel->id);
        }

        $this->command->info('✓ Issues created');
    }
}