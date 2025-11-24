<?php

namespace App\Models\Workflow;

use App\Models\Ticketing\{Project, Status};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowTransition extends Model
{
  protected $fillable = [
    'project_id',
    'from_status_id',
    'to_status_id',
    'name',
    'description',
  ];

  /**
   * Projet auquel appartient la transition
   */
  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  /**
   * Statut de départ
   */
  public function fromStatus(): BelongsTo
  {
    return $this->belongsTo(Status::class, 'from_status_id');
  }

  /**
   * Statut d'arrivée
   */
  public function toStatus(): BelongsTo
  {
    return $this->belongsTo(Status::class, 'to_status_id');
  }
}
