<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Auth\User;
use App\Models\Ticketing\Project;
use App\Models\Teams\Team;
use App\Services\Permission\PermissionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class PermissionSystemTest extends TestCase
{
    use RefreshDatabase;

    protected PermissionService $permissionService;

    protected function setUp(): void
    {
        parent::setUp();

        // Seeder les permissions
        $this->seed(\Database\Seeders\PermissionSeeder::class);

        $this->permissionService = app(PermissionService::class);
    }

    #[Test]
    public function super_admin_can_do_everything(): void
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $project = Project::factory()->create();

        $this->assertTrue(
            $this->permissionService->userCanOnProject($superAdmin, 'project.delete', $project)
        );
    }

    #[Test]
    public function project_admin_can_manage_project(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $project = Project::factory()->create();

        // Attacher l'utilisateur comme admin du projet
        $project->members()->attach($user->id, ['role' => 'admin']);

        $this->assertTrue(
            $this->permissionService->userCanOnProject($user, 'project.update', $project)
        );

        $this->assertTrue(
            $this->permissionService->userCanOnProject($user, 'issue.create', $project)
        );
    }

    #[Test]
    public function contributor_cannot_delete_project(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $project = Project::factory()->create();

        $project->members()->attach($user->id, ['role' => 'contributor']);

        $this->assertFalse(
            $this->permissionService->userCanOnProject($user, 'project.delete', $project)
        );
    }

    #[Test]
    public function viewer_can_only_view(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $project = Project::factory()->create();

        $project->members()->attach($user->id, ['role' => 'viewer']);

        $this->assertTrue(
            $this->permissionService->userCanOnProject($user, 'project.view', $project)
        );

        $this->assertFalse(
            $this->permissionService->userCanOnProject($user, 'issue.create', $project)
        );
    }

    #[Test]
    public function team_owner_has_admin_permissions_on_project(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $team = Team::factory()->create();
        $project = Project::factory()->create(['team_id' => $team->id]);

        // Attacher l'utilisateur comme owner de la team
        $team->members()->attach($user->id, ['role' => 'owner']);

        $this->assertTrue(
            $this->permissionService->userCanOnProject($user, 'project.update', $project)
        );
    }
}
