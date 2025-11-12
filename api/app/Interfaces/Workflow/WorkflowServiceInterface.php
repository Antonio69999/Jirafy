<?php

namespace App\Interfaces\Workflow;

use App\Models\Workflow\WorkflowTransition;
use App\Models\Ticketing\{Issue, Project};
use Illuminate\Support\Collection;

interface WorkflowServiceInterface
{
  /**
   * Récupérer les transitions disponibles pour une issue
   */
  public function getAvailableTransitions(Issue $issue): Collection;

  /**
   * Effectuer une transition
   */
  public function performTransition(Issue $issue, int $transitionId): Issue;

  /**
   * Récupérer toutes les transitions d'un projet
   */
  public function getProjectTransitions(int $projectId): Collection;

  /**
   * Créer une transition
   */
  public function createTransition(array $data): WorkflowTransition;

  /**
   * Supprimer une transition
   */
  public function deleteTransition(WorkflowTransition $transition): bool;

  /**
   * Créer les transitions par défaut pour un projet
   */
  public function createDefaultTransitions(Project $project): void;
}
