<?php

namespace App\Services\Workflow;

use App\Interfaces\Workflow\WorkflowServiceInterface;
use App\Models\Workflow\WorkflowTransition;
use App\Models\Ticketing\{Issue, Project, Status};
use App\Models\Auth\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class WorkflowService implements WorkflowServiceInterface
{
  public function __construct(
    private WorkflowValidationService $validationService,
    private TransitionValidatorService $transitionValidator,
    private PostTransitionActionService $postActionService
  ) {}

  /**
   * Récupérer les transitions disponibles pour une issue
   * Accepter un utilisateur optionnel pour filtrer
   */
  public function getAvailableTransitions(Issue $issue, User $user = null): Collection
  {
    $transitions = WorkflowTransition::where('project_id', $issue->project_id)
      ->where('from_status_id', $issue->status_id)
      ->with(['toStatus:id,key,name,category']) // ✅ Charger toStatus
      ->get();

    // Si pas d'utilisateur, retourner toutes les transitions
    if (!$user) {
      return $transitions;
    }

    // Filtrer les transitions selon les permissions et conditions
    return $transitions->map(function ($transition) use ($issue, $user) {
      $validation = $this->transitionValidator->canPerformTransition(
        $user,
        $issue,
        $transition
      );

      // Ajouter les informations de validation à la transition
      $transition->validation_errors = $validation['errors'];
      $transition->is_allowed = $validation['allowed'];

      return $transition;
    });
  }

  /**
   * Effectuer une transition
   * Accepter l'utilisateur et valider
   */
  public function performTransition(Issue $issue, int $transitionId, User $user = null): Issue
  {
    return DB::transaction(function () use ($issue, $transitionId, $user) {
      $transition = WorkflowTransition::findOrFail($transitionId);

      // Vérifier que la transition est valide
      if ($transition->project_id !== $issue->project_id) {
        throw new \Exception('Cette transition n\'appartient pas au projet de l\'issue');
      }

      if ($transition->from_status_id !== $issue->status_id) {
        throw new \Exception('Transition invalide depuis le statut actuel');
      }

      // Valider les conditions et permissions
      if ($user) {
        $validation = $this->transitionValidator->canPerformTransition(
          $user,
          $issue,
          $transition
        );

        if (!$validation['allowed']) {
          throw new \Exception(implode(', ', $validation['errors']));
        }
      }

      // Mettre à jour le statut
      $issue->update(['status_id' => $transition->to_status_id]);

      // Exécuter les post-actions
      if ($user) {
        $this->postActionService->executeActions($issue, $transition, $user);

        // Enregistrer l'historique
        $this->logTransition($issue, $transition, $user);
      }

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
   * Créer les transitions par défaut pour un projet
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
  }

  /**
   * Valider le workflow d'un projet
   */
  public function validateWorkflow(Project $project): array
  {
    return $this->validationService->validateWorkflow($project);
  }

  /**
   * Enregistrer l'historique de transition
   */
  private function logTransition(
    Issue $issue,
    WorkflowTransition $transition,
    User $user
  ): void {
    DB::table('workflow_transition_history')->insert([
      'issue_id' => $issue->id,
      'transition_id' => $transition->id,
      'from_status_id' => $transition->from_status_id,
      'to_status_id' => $transition->to_status_id,
      'user_id' => $user->id,
      'created_at' => now(),
    ]);
  }

  public function updateTransition(WorkflowTransition $transition, array $data): WorkflowTransition
  {
    $transition->update($data);
    return $transition->fresh()->load(['fromStatus', 'toStatus']);
  }
}
