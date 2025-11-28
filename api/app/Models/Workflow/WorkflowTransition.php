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
    'conditions',
    'validators',
    'post_actions',
    'allowed_roles',  
  ];

  protected $casts = [
    'conditions' => 'array',
    'validators' => 'array',
    'post_actions' => 'array',
    'allowed_roles' => 'array',
  ];

  // Relations existantes...
  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function fromStatus(): BelongsTo
  {
    return $this->belongsTo(Status::class, 'from_status_id');
  }

  public function toStatus(): BelongsTo
  {
    return $this->belongsTo(Status::class, 'to_status_id');
  }
}
