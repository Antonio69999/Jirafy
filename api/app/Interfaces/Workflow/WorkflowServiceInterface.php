<?php

namespace App\Interfaces\Workflow;

use App\Models\Workflow\WorkflowTransition;
use App\Models\Ticketing\{Issue, Project};
use App\Models\Auth\User;
use Illuminate\Support\Collection;

interface WorkflowServiceInterface
{
  /**
   * Récupérer les transitions disponibles pour une issue
   * Accepter un utilisateur optionnel
   */
  public function getAvailableTransitions(Issue $issue, User $user = null): Collection;

  /**
   * Effectuer une transition
   * Accepter un utilisateur optionnel
   */
  public function performTransition(Issue $issue, int $transitionId, User $user = null): Issue;

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

  /**
   * Valider le workflow d'un projet
   */
  public function validateWorkflow(Project $project): array;

  /**
   * Mettre à jour une transition
   */
  public function updateTransition(WorkflowTransition $transition, array $data): WorkflowTransition;
}
