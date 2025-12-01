<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ticketing\Project;
use App\Models\Workflow\WorkflowTransition;
use App\Interfaces\Workflow\WorkflowServiceInterface;

class GenerateDefaultWorkflows extends Command
{
  protected $signature = 'workflow:generate-defaults';
  protected $description = 'Génère les transitions par défaut pour les projets qui n\'en ont pas';

  public function handle(WorkflowServiceInterface $workflowService)
  {
    $projects = Project::all();
    $created = 0;

    foreach ($projects as $project) {
      $transitionsCount = WorkflowTransition::where('project_id', $project->id)->count();

      if ($transitionsCount === 0) {
        $workflowService->createDefaultTransitions($project);
        $created++;
        $this->info("Transitions créées pour le projet {$project->key}");
      } elseif ($transitionsCount < 4) {
        WorkflowTransition::where('project_id', $project->id)->delete();
        $workflowService->createDefaultTransitions($project);
        $created++;
        $this->warn(" Transitions incomplètes recréées pour le projet {$project->key}");
      } else {
        $this->line("⏭️  Le projet {$project->key} a déjà des transitions ({$transitionsCount})");
      }
    }

    $this->info("\n{$created} projet(s) mis à jour");
  }
}
