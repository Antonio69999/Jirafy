<?php

namespace App\Services\Workflow;

use App\Models\Ticketing\Project;
use App\Models\Workflow\WorkflowTransition;
use Illuminate\Support\Collection;

class WorkflowValidationService
{
  /**
   * Valider le workflow d'un projet
   */
  public function validateWorkflow(Project $project): array
  {
    $statuses = $project->statuses;
    $transitions = WorkflowTransition::where('project_id', $project->id)
      ->with(['fromStatus', 'toStatus'])
      ->with(['toStatus:id,key,name,category'])
      ->get();

    $errors = [];
    $warnings = [];

    // ✅ Vérifier qu'il y a au moins 3 statuts
    if ($statuses->count() < 3) {
      $errors[] = 'Le workflow doit contenir au moins 3 statuts';
    }

    // ✅ Vérifier que TODO et DONE existent
    $todoStatus = $statuses->firstWhere('key', 'TODO');
    $doneStatus = $statuses->firstWhere('key', 'DONE');

    if (!$todoStatus) {
      $errors[] = 'Le statut TODO est requis';
    }
    if (!$doneStatus) {
      $errors[] = 'Le statut DONE est requis';
    }

    // ✅ Vérifier les statuts orphelins
    $orphans = $this->findOrphanStatuses($statuses, $transitions);
    if ($orphans->isNotEmpty()) {
      $orphanNames = $orphans->pluck('name')->join(', ');
      $errors[] = "Statuts orphelins (sans transition sortante) : {$orphanNames}";
    }

    // ✅ Vérifier qu'il existe un chemin de TODO → DONE
    if ($todoStatus && $doneStatus) {
      if (!$this->hasPathBetween($todoStatus->id, $doneStatus->id, $transitions)) {
        $errors[] = 'Aucun chemin trouvé entre TODO et DONE';
      }
    }

    // ⚠️ Warnings : Boucles potentielles
    $loops = $this->detectLoops($transitions);
    if ($loops->isNotEmpty()) {
      $warnings[] = 'Boucles détectées dans le workflow (peut causer des tickets bloqués)';
    }

    return [
      'valid' => count($errors) === 0,
      'errors' => $errors,
      'warnings' => $warnings,
    ];
  }

  /**
   * Trouver les statuts orphelins (sans transition sortante, sauf DONE)
   */
  private function findOrphanStatuses(Collection $statuses, Collection $transitions): Collection
  {
    return $statuses->filter(function ($status) use ($transitions) {
      // DONE n'a pas besoin de transition sortante
      if ($status->key === 'DONE') {
        return false;
      }

      // Vérifier si le statut a au moins une transition sortante
      return !$transitions->contains('from_status_id', $status->id);
    });
  }

  /**
   * Vérifier s'il existe un chemin entre deux statuts (BFS)
   */
  private function hasPathBetween(int $startId, int $endId, Collection $transitions): bool
  {
    $visited = [];
    $queue = [$startId];

    while (!empty($queue)) {
      $currentId = array_shift($queue);

      if ($currentId === $endId) {
        return true;
      }

      if (in_array($currentId, $visited)) {
        continue;
      }

      $visited[] = $currentId;

      // Ajouter les voisins à la queue
      $neighbors = $transitions
        ->where('from_status_id', $currentId)
        ->pluck('to_status_id')
        ->toArray();

      $queue = array_merge($queue, $neighbors);
    }

    return false;
  }

  /**
   * Détecter les boucles dans le workflow
   */
  private function detectLoops(Collection $transitions): Collection
  {
    $loops = collect();

    foreach ($transitions as $transition) {
      // Vérifier s'il existe un chemin de retour
      if ($this->hasPathBetween($transition->to_status_id, $transition->from_status_id, $transitions)) {
        $loops->push([
          'from' => $transition->fromStatus->name,
          'to' => $transition->toStatus->name,
        ]);
      }
    }

    return $loops->unique();
  }
}
