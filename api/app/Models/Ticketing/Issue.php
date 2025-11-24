<?php
// filepath: api/app/Models/Ticketing/Issue.php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Auth\User;
use Illuminate\Support\Facades\DB;

class Issue extends Model
{
  protected $fillable = [
    'project_id',
    'type_id',
    'status_id',
    'priority_id',
    'reporter_id',
    'assignee_id',
    'parent_id',
    'epic_id',
    'sprint_id',
    'number',
    'key',
    'title',
    'description',
    'story_points',
    'original_estimate',
    'remaining_estimate',
    'time_spent',
    'due_date',
    'resolution',
    'environment',
  ];

  protected $casts = [
    'story_points' => 'decimal:2',
    'original_estimate' => 'integer',
    'remaining_estimate' => 'integer',
    'time_spent' => 'integer',
    'due_date' => 'datetime',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
  ];

  /**
   *  Générer automatiquement le numéro séquentiel à la création
   */
  protected static function booted(): void
  {
    static::creating(function (Issue $issue) {
      if (empty($issue->number)) {
        // Récupérer le prochain numéro pour ce projet
        $maxNumber = DB::table('issues')
          ->where('project_id', $issue->project_id)
          ->max('number');

        $issue->number = ($maxNumber ?? 0) + 1;
      }

      // Générer la clé (ex: WEB-1, WEB-2)
      if (empty($issue->key) && $issue->project_id) {
        $project = Project::find($issue->project_id);
        if ($project) {
          $issue->key = "{$project->key}-{$issue->number}";
        }
      }
    });
  }

  // Relations
  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function type(): BelongsTo
  {
    return $this->belongsTo(IssueType::class, 'type_id');
  }

  public function status(): BelongsTo
  {
    return $this->belongsTo(Status::class);
  }

  public function priority(): BelongsTo
  {
    return $this->belongsTo(Priority::class);
  }

  public function reporter(): BelongsTo
  {
    return $this->belongsTo(User::class, 'reporter_id');
  }

  public function assignee(): BelongsTo
  {
    return $this->belongsTo(User::class, 'assignee_id');
  }

  public function parent(): BelongsTo
  {
    return $this->belongsTo(Issue::class, 'parent_id');
  }

  public function children(): HasMany
  {
    return $this->hasMany(Issue::class, 'parent_id');
  }

  public function epic(): BelongsTo
  {
    return $this->belongsTo(Issue::class, 'epic_id');
  }

  public function labels(): BelongsToMany
  {
    return $this->belongsToMany(Label::class, 'issue_labels', 'issue_id', 'label_id')
      ->withTimestamps();
  }

  public function comments(): HasMany
  {
    return $this->hasMany(Comment::class);
  }

  public function attachments(): HasMany
  {
    return $this->hasMany(Attachment::class);
  }
}
