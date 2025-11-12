<?php

namespace App\Services\Ticketing;

use App\Models\Ticketing\{Project, Status, ProjectStatus};
use App\Interfaces\Ticketing\ProjectServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use App\Interfaces\Workflow\WorkflowServiceInterface;

class ProjectService implements ProjectServiceInterface
{
  public function __construct(
    private WorkflowServiceInterface $workflowService
  ) {}

  public function createProject(array $data): Project
  {
    $data['key'] = strtoupper(trim($data['key']));

    return DB::transaction(function () use ($data) {
      /** @var Project $project */
      $project = Project::create([
        "team_id" => $data['team_id'] ?? null,
        "key" => $data['key'],
        "name" => $data['name'],
        "description" => $data['description'] ?? null,
        "lead_user_id" => $data['lead_user_id'] ?? null,
        "issue_seq" => $data['issue_seq'] ?? 0
      ]);

      $defaultsOrder = ['TODO' => 1, 'IN_PROGRESS' => 2, 'DONE' => 3];
      $statuses = Status::query()->get(['id', 'key']);
      $rows = [];
      foreach ($statuses as $s) {
        $rows[] = [
          'project_id' => $project->id,
          'status_id'  => $s->id,
          'position'   => $defaultsOrder[$s->key] ?? 99,
          'is_default' => ($s->key === 'TODO'),
          'created_at' => now(),
          'updated_at' => now(),
        ];
      }
      if ($rows) {
        ProjectStatus::insert($rows);
      }

      $this->workflowService->createDefaultTransitions($project);

      return $project->load(['team:id,slug,name', 'lead:id,name,email']);
    });
  }

  public function getProjectById(int $id): ?Project
  {
    return Project::query()
      ->with(['team:id,slug,name', 'lead:id,name,email'])
      ->find($id);
  }

  public function updateProject(Project $project, array $data): Project
  {
    $data['key'] = strtoupper(trim($data['key']));

    $project->fill([
      'team_id'      => $data['team_id']      ?? $project->team_id,
      'key'          => $data['key']          ?? $project->key,
      'name'         => $data['name']         ?? $project->name,
      'description'  => $data['description']  ?? $project->description,
      'lead_user_id' => $data['lead_user_id'] ?? $project->lead_user_id,
    ])->save();

    return $project->load(['team:id,slug,name', 'lead:id,name,email']);
  }

  public function deleteProject(Project $project): bool
  {
    return DB::transaction(function () use ($project) {
      return $project->delete();
    });
  }

  public function getAllProjects(array $filters = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = Project::query()
      ->with(['team:id,slug,name', 'lead:id,name,email'])
      ->withCount('issues');

    if (!empty($filters['team_id'])) {
      $query->where('team_id', (int)$filters['team_id']);
    }

    if (!empty($filters['search'])) {
      $term = $filters['search'];
      $query->where(function ($w) use ($term) {
        $w->where('name', 'ilike', "%{$term}%")
          ->orWhere('key', 'ilike', "%{$term}%");
      });
    }

    if (!empty($filters['order_by'])) {
      $dir = $filters['order_dir'] ?? 'asc';
      $query->orderBy($filters['order_by'], $dir);
    } else {
      $query->orderBy('created_at', 'desc');
    }

    return $query->paginate($perPage);
  }
}
