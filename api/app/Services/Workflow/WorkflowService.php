<?php

namespace App\Services\Workflow;

use App\Interfaces\Workflow\WorkflowServiceInterface;
use App\Models\Workflow\WorkflowTransition;
use App\Models\Ticketing\{Issue, Project, Status};
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class WorkflowService implements WorkflowServiceInterface
{
  /**
   * Récupérer les transitions disponibles pour une issue
   */
  public function getAvailableTransitions(Issue $issue): Collection
  {
    return WorkflowTransition::where('project_id', $issue->project_id)
      ->where('from_status_id', $issue->status_id)
      ->with(['toStatus:id,key,name,category'])
      ->get();
  }

  /**
   * Effectuer une transition
   */
  public function performTransition(Issue $issue, int $transitionId): Issue
  {
    return DB::transaction(function () use ($issue, $transitionId) {
      $transition = WorkflowTransition::findOrFail($transitionId);

      // Vérifier que la transition est valide
      if ($transition->project_id !== $issue->project_id) {
        throw new \Exception('Cette transition n\'appartient pas au projet de l\'issue');
      }

      if ($transition->from_status_id !== $issue->status_id) {
        throw new \Exception('Transition invalide depuis le statut actuel');
      }

      // Mettre à jour le statut
      $issue->update(['status_id' => $transition->to_status_id]);

      return $issue->fresh()->load([
        'project:id,key,name',
        'type:id,key,name',
        'status:id,key,name,category',
        'priority:id,key,name,weight',
        'reporter:id,name,email',
        'assignee:id,name,email',
      ]);
    });
  }

  /**
   * Récupérer toutes les transitions d'un projet
   */
  public function getProjectTransitions(int $projectId): Collection
  {
    return WorkflowTransition::where('project_id', $projectId)
      ->with(['fromStatus:id,key,name', 'toStatus:id,key,name'])
      ->orderBy('from_status_id')
      ->get();
  }

  /**
   * Créer une transition
   */
  public function createTransition(array $data): WorkflowTransition
  {
    return WorkflowTransition::create($data);
  }

  /**
   * Supprimer une transition
   */
  public function deleteTransition(WorkflowTransition $transition): bool
  {
    return $transition->delete();
  }

  /**
   * Créer les transitions par défaut pour un projet (Kanban basique)
   */
  public function createDefaultTransitions(Project $project): void
  {
    $todo = Status::where('key', 'TODO')->first();
    $inProgress = Status::where('key', 'IN_PROGRESS')->first();
    $done = Status::where('key', 'DONE')->first();

    if (!$todo || !$inProgress || !$done) {
      return;
    }

    // TODO → IN_PROGRESS
    WorkflowTransition::create([
      'project_id' => $project->id,
      'from_status_id' => $todo->id,
      'to_status_id' => $inProgress->id,
      'name' => 'Start Progress',
      'description' => 'Commencer à travailler sur la tâche',
    ]);

    // IN_PROGRESS → DONE
    WorkflowTransition::create([
      'project_id' => $project->id,
      'from_status_id' => $inProgress->id,
      'to_status_id' => $done->id,
      'name' => 'Complete',
      'description' => 'Terminer la tâche',
    ]);

    // IN_PROGRESS → TODO (retour arrière)
    WorkflowTransition::create([
      'project_id' => $project->id,
      'from_status_id' => $inProgress->id,
      'to_status_id' => $todo->id,
      'name' => 'Reopen',
      'description' => 'Remettre la tâche en attente',
    ]);

    // DONE → IN_PROGRESS (réouverture)
    WorkflowTransition::create([
      'project_id' => $project->id,
      'from_status_id' => $done->id,
      'to_status_id' => $inProgress->id,
      'name' => 'Reopen',
      'description' => 'Rouvrir la tâche terminée',
    ]);
  }
}
