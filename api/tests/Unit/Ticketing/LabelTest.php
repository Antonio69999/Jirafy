<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Auth\User;
use App\Models\Ticketing\{Project, Label};
use App\Models\Teams\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class LabelTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Project $project;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // Seeder les permissions
        $this->seed(\Database\Seeders\PermissionSeeder::class);

        // Créer un utilisateur
        $this->user = User::factory()->create(['role' => 'user']);

        // Créer une équipe et un projet
        $this->team = Team::factory()->create();
        $this->team->members()->attach($this->user->id, ['role' => 'admin']);

        $this->project = Project::factory()->create([
            'team_id' => $this->team->id,
        ]);
        $this->project->members()->attach($this->user->id, ['role' => 'admin']);
    }

    #[Test]
    public function user_can_create_label_in_their_project(): void
    {
        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/labels', [
                'name' => 'Test Label',
                'color' => '#ff0000',
                'description' => 'Test description',
                'project_id' => $this->project->id,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Test Label',
                    'color' => '#ff0000',
                ],
            ]);

        $this->assertDatabaseHas('labels', [
            'name' => 'Test Label',
            'project_id' => $this->project->id,
        ]);
    }

    #[Test]
    public function user_cannot_create_label_in_project_without_permission(): void
    {
        $otherProject = Project::factory()->create();

        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/labels', [
                'name' => 'Test Label',
                'color' => '#ff0000',
                'project_id' => $otherProject->id,
            ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function only_admins_can_create_global_labels(): void
    {
        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/labels', [
                'name' => 'Global Label',
                'color' => '#00ff00',
                'project_id' => null,
            ]);

        $response->assertStatus(403);

        // Avec un admin
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/labels', [
                'name' => 'Global Label',
                'color' => '#00ff00',
                'project_id' => null,
            ]);

        $response->assertStatus(201);
    }

    #[Test]
    public function user_can_update_label_in_their_project(): void
    {
        $label = Label::factory()->forProject($this->project)->create();

        $response = $this->actingAs($this->user, 'api')
            ->putJson("/api/labels/{$label->id}", [
                'name' => 'Updated Label',
                'color' => '#0000ff',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated Label',
                ],
            ]);
    }

    #[Test]
    public function user_can_delete_label_in_their_project(): void
    {
        $label = Label::factory()->forProject($this->project)->create();

        $response = $this->actingAs($this->user, 'api')
            ->deleteJson("/api/labels/{$label->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('labels', [
            'id' => $label->id,
        ]);
    }

    #[Test]
    public function can_retrieve_available_labels_for_project(): void
    {
        // Créer des labels globaux
        Label::factory()->global()->count(3)->create();

        // Créer des labels pour le projet
        Label::factory()->forProject($this->project)->count(2)->create();

        $response = $this->actingAs($this->user, 'api')
            ->getJson("/api/projects/{$this->project->id}/labels/available");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'color', 'project_id'],
                ],
            ]);

        // Doit contenir 5 labels (3 globaux + 2 du projet)
        $this->assertCount(5, $response->json('data'));
    }
}
