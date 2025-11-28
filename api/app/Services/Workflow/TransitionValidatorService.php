<?php

namespace App\Services\Workflow;

use App\Models\Ticketing\Issue;
use App\Models\Workflow\WorkflowTransition;
use App\Models\Auth\User;

class TransitionValidatorService
{
  /**
   * Vérifier si une transition peut être effectuée
   */
  public function canPerformTransition(
    User $user,
    Issue $issue,
    WorkflowTransition $transition
  ): array {
    $errors = [];

    // 1. Vérifier les permissions de rôle
    if (!$this->checkRolePermission($user, $transition)) {
      $errors[] = 'Vous n\'avez pas le rôle requis pour cette transition';
    }

    // 2. Vérifier les conditions métier
    $conditionErrors = $this->validateConditions($issue, $transition);
    $errors = array_merge($errors, $conditionErrors);

    // 3. Vérifier les validators (champs requis)
    $validatorErrors = $this->validateRequiredFields($issue, $transition);
    $errors = array_merge($errors, $validatorErrors);

    return [
      'allowed' => count($errors) === 0,
      'errors' => $errors,
    ];
  }

  /**
   * Vérifier les permissions de rôle
   */
  private function checkRolePermission(User $user, WorkflowTransition $transition): bool
  {
    // Si aucun rôle spécifique n'est défini, tout le monde peut effectuer la transition
    if (empty($transition->allowed_roles)) {
      return true;
    }

    // Vérifier si l'utilisateur a un des rôles autorisés
    return in_array($user->role, $transition->allowed_roles);
  }

  /**
   * Valider les conditions métier
   */
  private function validateConditions(Issue $issue, WorkflowTransition $transition): array
  {
    $errors = [];

    if (empty($transition->conditions)) {
      return $errors;
    }

    foreach ($transition->conditions as $condition) {
      $result = $this->evaluateCondition($issue, $condition);
      if (!$result['valid']) {
        $errors[] = $result['message'];
      }
    }

    return $errors;
  }

  /**
   * Évaluer une condition
   */
  private function evaluateCondition(Issue $issue, array $condition): array
  {
    $type = $condition['type'] ?? null;

    switch ($type) {
      case 'assignee_required':
        return [
          'valid' => !is_null($issue->assignee_id),
          'message' => 'Un assigné est requis pour cette transition',
        ];

      case 'description_required':
        return [
          'valid' => !empty($issue->description),
          'message' => 'Une description est requise pour cette transition',
        ];

      case 'subtasks_completed':
        // TODO: Implémenter la logique des sous-tâches
        return ['valid' => true, 'message' => ''];

      case 'estimated_time_required':
        return [
          'valid' => !is_null($issue->estimated_hours),
          'message' => 'Le temps estimé est requis pour cette transition',
        ];

      default:
        return ['valid' => true, 'message' => ''];
    }
  }

  /**
   * Valider les champs requis
   */
  private function validateRequiredFields(Issue $issue, WorkflowTransition $transition): array
  {
    $errors = [];

    if (empty($transition->validators)) {
      return $errors;
    }

    foreach ($transition->validators as $validator) {
      $field = $validator['field'] ?? null;
      $message = $validator['message'] ?? "Le champ {$field} est requis";

      if (!$field) continue;

      // Vérifier si le champ est rempli
      if (empty($issue->{$field})) {
        $errors[] = $message;
      }
    }

    return $errors;
  }
}
