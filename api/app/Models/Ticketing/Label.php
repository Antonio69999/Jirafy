<?php

namespace App\Models\Ticketing;

use Database\Factories\LabelFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Label extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'color',
        'description',
        'project_id'
    ];

    protected $casts = [
        'project_id' => 'integer',
    ];

    /**
     * Projet auquel appartient le label (peut être null pour labels globaux)
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Issues utilisant ce label
     */
    public function issues(): BelongsToMany
    {
        return $this->belongsToMany(Issue::class, 'issue_labels')
            ->withTimestamps();
    }

    /**
     * Scope pour les labels globaux (sans projet)
     */
    public function scopeGlobal($query)
    {
        return $query->whereNull('project_id');
    }

    /**
     * Scope pour les labels d'un projet spécifique
     */
    public function scopeForProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    /**
     * Scope pour les labels disponibles pour un projet (globaux + projet)
     */
    public function scopeAvailableForProject($query, int $projectId)
    {
        return $query->where(function ($q) use ($projectId) {
            $q->whereNull('project_id')
                ->orWhere('project_id', $projectId);
        });
    }

        /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return LabelFactory::new();
    }
}
