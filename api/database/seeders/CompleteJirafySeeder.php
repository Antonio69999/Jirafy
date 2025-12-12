<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Auth\User;
use App\Models\Teams\Team;
use App\Models\Ticketing\{Project, Issue, Label, Status};
use App\Models\Organizations\Organization;
use Illuminate\Support\Facades\DB;
use App\Services\Ticketing\IssueService;

class CompleteJirafySeeder extends Seeder
{
  protected IssueService $issueService;

  public function __construct(IssueService $issueService)
  {
    $this->issueService = $issueService;
  }

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
    User::create([
      'name' => 'Super Admin',
      'email' => 'admin@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'super_admin',
    ]);

    User::create([
      'name' => 'Admin User',
      'email' => 'admin2@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'admin',
    ]);

    // ==================== UTILISATEURS INTERNES ====================
    User::create([
      'name' => 'Alice Developer',
      'email' => 'alice@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'user',
    ]);

    User::create([
      'name' => 'Bob Backend',
      'email' => 'bob@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'user',
    ]);

    User::create([
      'name' => 'Clara Designer',
      'email' => 'clara@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'user',
    ]);

    User::create([
      'name' => 'David PM',
      'email' => 'david@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'user',
    ]);

    User::create([
      'name' => 'Emma QA',
      'email' => 'emma@jirafy.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'user',
    ]);

    User::create([
      'name' => 'Frank DevOps',
      'email' => 'frank@jirafy.com',
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
      'description' => 'Leader dans la technologie et l\'innovation',
      'is_active' => true,
    ]);

    $globex = Organization::create([
      'slug' => 'globex',
      'name' => 'Globex Corporation',
      'domain' => 'globex.com',
      'description' => 'Entreprise internationale de services',
      'is_active' => true,
    ]);

    $techstart = Organization::create([
      'slug' => 'techstart',
      'name' => 'TechStart Inc',
      'domain' => 'techstart.io',
      'description' => 'Startup technologique innovante',
      'is_active' => true,
    ]);

    // ==================== CLIENTS ====================
    User::create([
      'name' => 'John Smith',
      'email' => 'john@acme.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'customer',
      'organization_id' => $acme->id,
    ]);

    User::create([
      'name' => 'Jane Doe',
      'email' => 'jane@acme.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'customer',
      'organization_id' => $acme->id,
    ]);

    User::create([
      'name' => 'Mike Johnson',
      'email' => 'mike@globex.com',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'customer',
      'organization_id' => $globex->id,
    ]);

    User::create([
      'name' => 'Sarah Williams',
      'email' => 'sarah@techstart.io',
      'password' => bcrypt('password123'),
      'email_verified_at' => now(),
      'role' => 'customer',
      'organization_id' => $techstart->id,
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
    $qa = User::where('email', 'emma@jirafy.com')->first();
    $devops = User::where('email', 'frank@jirafy.com')->first();
    $admin = User::where('email', 'admin@jirafy.com')->first();

    // ==================== ÉQUIPE DÉVELOPPEMENT ====================
    $devTeam = Team::create([
      'slug' => 'dev-team',
      'name' => 'Engineering Team',
      'description' => 'Équipe de développement full-stack',
    ]);

    $devTeam->members()->attach([
      $dev1->id => ['role' => 'owner'],
      $dev2->id => ['role' => 'admin'],
      $devops->id => ['role' => 'member'],
    ]);

    // ==================== ÉQUIPE DESIGN ====================
    $designTeam = Team::create([
      'slug' => 'design-team',
      'name' => 'Design Team',
      'description' => 'Équipe UX/UI et design system',
    ]);

    $designTeam->members()->attach([
      $designer->id => ['role' => 'owner'],
      $dev1->id => ['role' => 'member'],
    ]);

    // ==================== ÉQUIPE QA ====================
    $qaTeam = Team::create([
      'slug' => 'qa-team',
      'name' => 'Quality Assurance',
      'description' => 'Équipe de tests et qualité',
    ]);

    $qaTeam->members()->attach([
      $qa->id => ['role' => 'owner'],
      $dev2->id => ['role' => 'member'],
    ]);

    // ==================== ÉQUIPE PROJET ====================
    $projectTeam = Team::create([
      'slug' => 'project-team',
      'name' => 'Project Management',
      'description' => 'Gestion de projet et coordination',
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
    $qaTeam = Team::where('slug', 'qa-team')->first();

    $dev1 = User::where('email', 'alice@jirafy.com')->first();
    $dev2 = User::where('email', 'bob@jirafy.com')->first();
    $pm = User::where('email', 'david@jirafy.com')->first();
    $designer = User::where('email', 'clara@jirafy.com')->first();
    $qa = User::where('email', 'emma@jirafy.com')->first();

    $acme = Organization::where('slug', 'acme-corp')->first();
    $globex = Organization::where('slug', 'globex')->first();
    $techstart = Organization::where('slug', 'techstart')->first();

    $statuses = Status::all();

    // ==================== PROJET 1 : E-Commerce Platform ====================
    $ecomProject = Project::create([
      'key' => 'ECOM',
      'name' => 'E-Commerce Platform',
      'description' => 'Plateforme e-commerce moderne avec React et Node.js',
      'team_id' => $devTeam->id,
      'lead_user_id' => $dev1->id,
    ]);

    $acme->projects()->attach($ecomProject->id);

    foreach ($statuses as $index => $status) {
      DB::table('project_statuses')->insert([
        'project_id' => $ecomProject->id,
        'status_id' => $status->id,
        'position' => $index + 1,
        'is_default' => $status->key === 'TODO',
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // ==================== PROJET 2 : Mobile Banking App ====================
    $bankingProject = Project::create([
      'key' => 'BANK',
      'name' => 'Mobile Banking App',
      'description' => 'Application bancaire iOS/Android sécurisée',
      'team_id' => $devTeam->id,
      'lead_user_id' => $pm->id,
    ]);

    $globex->projects()->attach($bankingProject->id);

    foreach ($statuses as $index => $status) {
      DB::table('project_statuses')->insert([
        'project_id' => $bankingProject->id,
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
      'description' => 'Bibliothèque de composants et design tokens',
      'team_id' => $designTeam->id,
      'lead_user_id' => $designer->id,
    ]);

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

    // ==================== PROJET 4 : SaaS Dashboard ====================
    $saasProject = Project::create([
      'key' => 'SAAS',
      'name' => 'SaaS Analytics Dashboard',
      'description' => 'Tableau de bord analytics pour startups',
      'team_id' => $devTeam->id,
      'lead_user_id' => $dev2->id,
    ]);

    $techstart->projects()->attach($saasProject->id);

    foreach ($statuses as $index => $status) {
      DB::table('project_statuses')->insert([
        'project_id' => $saasProject->id,
        'status_id' => $status->id,
        'position' => $index + 1,
        'is_default' => $status->key === 'TODO',
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // ==================== PROJET 5 : API Gateway ====================
    $apiProject = Project::create([
      'key' => 'API',
      'name' => 'API Gateway',
      'description' => 'Gateway API avec authentification et rate limiting',
      'team_id' => $devTeam->id,
      'lead_user_id' => $dev2->id,
    ]);

    foreach ($statuses as $index => $status) {
      DB::table('project_statuses')->insert([
        'project_id' => $apiProject->id,
        'status_id' => $status->id,
        'position' => $index + 1,
        'is_default' => $status->key === 'TODO',
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // ==================== PROJET 6 : QA Automation ====================
    $qaProject = Project::create([
      'key' => 'QA',
      'name' => 'Test Automation Framework',
      'description' => 'Framework de tests automatisés E2E',
      'team_id' => $qaTeam->id,
      'lead_user_id' => $qa->id,
    ]);

    foreach ($statuses as $index => $status) {
      DB::table('project_statuses')->insert([
        'project_id' => $qaProject->id,
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
      ['name' => 'urgent', 'color' => '#dc2626', 'description' => 'Priorité urgente'],
      ['name' => 'help-wanted', 'color' => '#8b5cf6', 'description' => 'Besoin d\'aide'],
      ['name' => 'security', 'color' => '#ef4444', 'description' => 'Sécurité'],
      ['name' => 'performance', 'color' => '#f59e0b', 'description' => 'Performance'],
    ];

    foreach ($globalLabels as $labelData) {
      Label::create($labelData);
    }

    // ==================== LABELS PAR PROJET ====================
    $projects = Project::all();

    foreach ($projects as $project) {
      if ($project->key === 'ECOM') {
        Label::create(['name' => 'frontend', 'color' => '#ec4899', 'description' => 'Frontend React', 'project_id' => $project->id]);
        Label::create(['name' => 'backend', 'color' => '#14b8a6', 'description' => 'Backend Node.js', 'project_id' => $project->id]);
        Label::create(['name' => 'payment', 'color' => '#8b5cf6', 'description' => 'Système de paiement', 'project_id' => $project->id]);
        Label::create(['name' => 'cart', 'color' => '#3b82f6', 'description' => 'Panier d\'achat', 'project_id' => $project->id]);
      } elseif ($project->key === 'BANK') {
        Label::create(['name' => 'ios', 'color' => '#3b82f6', 'description' => 'iOS', 'project_id' => $project->id]);
        Label::create(['name' => 'android', 'color' => '#22c55e', 'description' => 'Android', 'project_id' => $project->id]);
        Label::create(['name' => 'biometric', 'color' => '#8b5cf6', 'description' => 'Authentification biométrique', 'project_id' => $project->id]);
        Label::create(['name' => 'transaction', 'color' => '#f59e0b', 'description' => 'Transactions', 'project_id' => $project->id]);
      } elseif ($project->key === 'DS') {
        Label::create(['name' => 'component', 'color' => '#ec4899', 'description' => 'Composant UI', 'project_id' => $project->id]);
        Label::create(['name' => 'token', 'color' => '#f59e0b', 'description' => 'Design token', 'project_id' => $project->id]);
        Label::create(['name' => 'accessibility', 'color' => '#22c55e', 'description' => 'Accessibilité', 'project_id' => $project->id]);
      } elseif ($project->key === 'SAAS') {
        Label::create(['name' => 'analytics', 'color' => '#8b5cf6', 'description' => 'Analytics', 'project_id' => $project->id]);
        Label::create(['name' => 'dashboard', 'color' => '#3b82f6', 'description' => 'Dashboard', 'project_id' => $project->id]);
        Label::create(['name' => 'charts', 'color' => '#22c55e', 'description' => 'Graphiques', 'project_id' => $project->id]);
      } elseif ($project->key === 'API') {
        Label::create(['name' => 'auth', 'color' => '#ef4444', 'description' => 'Authentification', 'project_id' => $project->id]);
        Label::create(['name' => 'rate-limit', 'color' => '#f59e0b', 'description' => 'Rate limiting', 'project_id' => $project->id]);
        Label::create(['name' => 'cache', 'color' => '#14b8a6', 'description' => 'Cache', 'project_id' => $project->id]);
      } elseif ($project->key === 'QA') {
        Label::create(['name' => 'e2e', 'color' => '#8b5cf6', 'description' => 'Tests E2E', 'project_id' => $project->id]);
        Label::create(['name' => 'unit', 'color' => '#22c55e', 'description' => 'Tests unitaires', 'project_id' => $project->id]);
        Label::create(['name' => 'integration', 'color' => '#3b82f6', 'description' => 'Tests d\'intégration', 'project_id' => $project->id]);
      }
    }

    $this->command->info('✓ Labels created');
  }

  private function seedIssues(): void
  {
    $this->command->info('📝 Seeding issues...');

    $ecomProject = Project::where('key', 'ECOM')->first();
    $bankingProject = Project::where('key', 'BANK')->first();
    $dsProject = Project::where('key', 'DS')->first();
    $saasProject = Project::where('key', 'SAAS')->first();
    $apiProject = Project::where('key', 'API')->first();
    $qaProject = Project::where('key', 'QA')->first();

    $dev1 = User::where('email', 'alice@jirafy.com')->first();
    $dev2 = User::where('email', 'bob@jirafy.com')->first();
    $designer = User::where('email', 'clara@jirafy.com')->first();
    $qa = User::where('email', 'emma@jirafy.com')->first();
    $devops = User::where('email', 'frank@jirafy.com')->first();
    $customer1 = User::where('email', 'john@acme.com')->first();
    $customer2 = User::where('email', 'mike@globex.com')->first();

    $typeTask = DB::table('issue_types')->where('key', 'TASK')->first();
    $typeBug = DB::table('issue_types')->where('key', 'BUG')->first();
    $typeStory = DB::table('issue_types')->where('key', 'STORY')->first();
    $typeEpic = DB::table('issue_types')->where('key', 'EPIC')->first();

    $statusTodo = Status::where('key', 'TODO')->first();
    $statusInProgress = Status::where('key', 'IN_PROGRESS')->first();
    $statusDone = Status::where('key', 'DONE')->first();
    $statusInReview = Status::where('key', 'IN_REVIEW')->first();

    $priorityHigh = DB::table('priorities')->where('key', 'HIGH')->first();
    $priorityMedium = DB::table('priorities')->where('key', 'MEDIUM')->first();
    $priorityLow = DB::table('priorities')->where('key', 'LOW')->first();

    // ==================== ISSUES E-COMMERCE ====================
    $issue1 = $this->issueService->createIssue([
      'project_id' => $ecomProject->id,
      'type_id' => $typeEpic->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $customer1->id,
      'assignee_id' => $dev1->id,
      'title' => 'Système de panier d\'achat avancé',
      'description' => 'Implémenter un système de panier avec sauvegarde, wishlist et recommandations',
      'story_points' => 21,
      'due_date' => now()->addDays(30)->format('Y-m-d'),
    ]);

    $this->issueService->createIssue([
      'project_id' => $ecomProject->id,
      'type_id' => $typeStory->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $dev1->id,
      'assignee_id' => $dev1->id,
      'title' => 'Page produit responsive',
      'description' => 'Créer une page produit moderne avec galerie d\'images, avis clients et variantes',
      'story_points' => 8,
    ]);

    $this->issueService->createIssue([
      'project_id' => $ecomProject->id,
      'type_id' => $typeBug->id,
      'status_id' => $statusTodo->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $customer1->id,
      'assignee_id' => $dev2->id,
      'title' => 'Erreur calcul des frais de port',
      'description' => 'Les frais de port ne sont pas correctement calculés pour les livraisons internationales',
      'due_date' => now()->addDays(2)->format('Y-m-d'),
    ]);

    $this->issueService->createIssue([
      'project_id' => $ecomProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusDone->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $dev1->id,
      'assignee_id' => $dev2->id,
      'title' => 'Intégration Stripe',
      'description' => 'Mettre en place le paiement via Stripe avec webhooks',
      'story_points' => 5,
    ]);

    // ==================== ISSUES BANKING ====================
    $this->issueService->createIssue([
      'project_id' => $bankingProject->id,
      'type_id' => $typeStory->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $customer2->id,
      'assignee_id' => $dev2->id,
      'title' => 'Authentification biométrique',
      'description' => 'Implémenter Touch ID et Face ID pour sécuriser l\'accès',
      'story_points' => 13,
    ]);

    $this->issueService->createIssue([
      'project_id' => $bankingProject->id,
      'type_id' => $typeBug->id,
      'status_id' => $statusInReview->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $qa->id,
      'assignee_id' => $dev2->id,
      'title' => 'Crash lors du transfert',
      'description' => 'L\'application plante lors d\'un transfert avec montant > 10000€',
      'due_date' => now()->addDay()->format('Y-m-d'),
    ]);

    $this->issueService->createIssue([
      'project_id' => $bankingProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusTodo->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $dev2->id,
      'assignee_id' => $devops->id,
      'title' => 'Cryptage des données sensibles',
      'description' => 'Mettre en place le cryptage end-to-end pour les transactions',
      'story_points' => 8,
    ]);

    // ==================== ISSUES DESIGN SYSTEM ====================
    $this->issueService->createIssue([
      'project_id' => $dsProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $designer->id,
      'assignee_id' => $designer->id,
      'title' => 'Composant Button',
      'description' => 'Créer le composant Button avec toutes les variantes (primary, secondary, ghost, etc.)',
      'story_points' => 5,
    ]);

    $this->issueService->createIssue([
      'project_id' => $dsProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusTodo->id,
      'priority_id' => $priorityLow->id,
      'reporter_id' => $designer->id,
      'assignee_id' => $designer->id,
      'title' => 'Documentation Storybook',
      'description' => 'Documenter tous les composants dans Storybook avec exemples',
      'story_points' => 8,
    ]);

    // ==================== ISSUES SAAS ====================
    $this->issueService->createIssue([
      'project_id' => $saasProject->id,
      'type_id' => $typeStory->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $dev1->id,
      'assignee_id' => $dev1->id,
      'title' => 'Dashboard temps réel',
      'description' => 'Créer un dashboard avec graphiques temps réel et filtres avancés',
      'story_points' => 13,
    ]);

    $this->issueService->createIssue([
      'project_id' => $saasProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusTodo->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $dev1->id,
      'assignee_id' => $dev2->id,
      'title' => 'Export CSV/PDF',
      'description' => 'Permettre l\'export des données en CSV et PDF',
      'story_points' => 5,
    ]);

    // ==================== ISSUES API ====================
    $this->issueService->createIssue([
      'project_id' => $apiProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityHigh->id,
      'reporter_id' => $dev2->id,
      'assignee_id' => $dev2->id,
      'title' => 'Rate limiting par endpoint',
      'description' => 'Implémenter le rate limiting avec Redis',
      'story_points' => 8,
    ]);

    $this->issueService->createIssue([
      'project_id' => $apiProject->id,
      'type_id' => $typeBug->id,
      'status_id' => $statusTodo->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $qa->id,
      'assignee_id' => $dev2->id,
      'title' => 'JWT expiration non gérée',
      'description' => 'Les tokens expirés ne sont pas correctement rafraîchis',
    ]);

    // ==================== ISSUES QA ====================
    $this->issueService->createIssue([
      'project_id' => $qaProject->id,
      'type_id' => $typeTask->id,
      'status_id' => $statusInProgress->id,
      'priority_id' => $priorityMedium->id,
      'reporter_id' => $qa->id,
      'assignee_id' => $qa->id,
      'title' => 'Tests E2E Cypress',
      'description' => 'Créer la suite de tests E2E pour les flows principaux',
      'story_points' => 8,
    ]);

    // Attacher des labels
    $bugLabel = Label::where('name', 'bug')->whereNull('project_id')->first();
    $urgentLabel = Label::where('name', 'urgent')->whereNull('project_id')->first();
    $securityLabel = Label::where('name', 'security')->whereNull('project_id')->first();

    $issue1->labels()->attach($ecomProject->labels()->where('name', 'frontend')->first()?->id);
    $issue1->labels()->attach($ecomProject->labels()->where('name', 'cart')->first()?->id);

    $this->command->info('✓ Issues created');
  }
}
