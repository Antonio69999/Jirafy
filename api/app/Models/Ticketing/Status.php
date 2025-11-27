<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Status extends Model
{
  use HasFactory;

  protected $fillable = [
    'key',
    'name',
    'category',
    'project_id',
  ];

  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function issues()
  {
    return $this->hasMany(Issue::class, 'status_id');
  }

  public function projects(): BelongsToMany
  {
    return $this->belongsToMany(Project::class, 'project_statuses')
      ->withPivot(['position', 'is_default'])
      ->withTimestamps();
  }
}
