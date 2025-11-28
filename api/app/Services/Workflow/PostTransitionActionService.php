<?php

namespace App\Services\Workflow;

use App\Models\Ticketing\Issue;
use App\Models\Workflow\WorkflowTransition;
use App\Models\Auth\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class PostTransitionActionService
{
  /**
   * Exécuter les actions post-transition
   */
  public function executeActions(
    Issue $issue,
    WorkflowTransition $transition,
    User $user
  ): void {
    if (empty($transition->post_actions)) {
      return;
    }

    foreach ($transition->post_actions as $action) {
      $this->executeAction($issue, $action, $user);
    }
  }

  /**
   * Exécuter une action spécifique
   */
  private function executeAction(Issue $issue, array $action, User $user): void
  {
    $type = $action['type'] ?? null;

    try {
      switch ($type) {
        case 'send_email':
          $this->sendEmail($issue, $action);
          break;

        case 'assign_to':
          $this->assignTo($issue, $action);
          break;

        case 'set_field':
          $this->setField($issue, $action);
          break;

        case 'add_comment':
          $this->addComment($issue, $action, $user);
          break;

        case 'webhook':
          $this->triggerWebhook($issue, $action);
          break;

        default:
          Log::warning("Unknown post-action type: {$type}");
      }
    } catch (\Exception $e) {
      Log::error("Error executing post-action: " . $e->getMessage(), [
        'issue_id' => $issue->id,
        'action_type' => $type,
      ]);
    }
  }

  private function sendEmail(Issue $issue, array $action): void
  {
    // TODO: Implémenter l'envoi d'email
    Log::info("Email would be sent for issue {$issue->id}");
  }

  private function assignTo(Issue $issue, array $action): void
  {
    $userId = $action['user_id'] ?? null;
    if ($userId) {
      $issue->update(['assignee_id' => $userId]);
    }
  }

  private function setField(Issue $issue, array $action): void
  {
    $field = $action['field'] ?? null;
    $value = $action['value'] ?? null;

    if ($field && $value !== null) {
      $issue->update([$field => $value]);
    }
  }

  private function addComment(Issue $issue, array $action, User $user): void
  {
    // TODO: Implémenter l'ajout de commentaire
    Log::info("Comment would be added to issue {$issue->id}");
  }

  private function triggerWebhook(Issue $issue, array $action): void
  {
    // TODO: Implémenter les webhooks
    Log::info("Webhook would be triggered for issue {$issue->id}");
  }
}
