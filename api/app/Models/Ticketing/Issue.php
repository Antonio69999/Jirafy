<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Issue extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id','type_id','status_id','priority_id',
        'reporter_id','assignee_id',
        'number','issue_key','title','description','story_points','due_date'
        // si tu gardes plus tard: 'epic_id','parent_id'
    ];

    protected $casts = [
        'due_date' => 'date',
        'story_points' => 'float',
    ];

    public function project()  { return $this->belongsTo(Project::class); }
    public function type()     { return $this->belongsTo(IssueType::class, 'type_id'); }
    public function status()   { return $this->belongsTo(Status::class, 'status_id'); }
    public function priority() { return $this->belongsTo(Priority::class, 'priority_id'); }

    public function reporter() { return $this->belongsTo(\App\Models\User::class, 'reporter_id'); }
    public function assignee() { return $this->belongsTo(\App\Models\User::class, 'assignee_id'); }

    // réactive quand tu ajoutes les colonnes
    // public function epic()   { return $this->belongsTo(self::class, 'epic_id'); }
    // public function parent() { return $this->belongsTo(self::class, 'parent_id'); }
    // public function children(){ return $this->hasMany(self::class, 'parent_id'); }

    public function labels()   { return $this->belongsToMany(Label::class, 'issue_label')->withTimestamps(); }
    public function comments() { return $this->hasMany(Comment::class); }
    public function attachments(){ return $this->hasMany(Attachment::class); }

    // Scope de recherche plein-texte (utilise la colonne tsvector "search")
    public function scopeSearch($query, ?string $term)
    {
        if (!$term) return $query;
        return $query->whereRaw("search @@ plainto_tsquery('simple', ?)", [$term]);
    }

    // Projection pratique pour le dashboard (lookup joints)
    public function scopeWithLookups($query)
    {
        return $query
            ->leftJoin('issue_types as it', 'it.id', '=', 'issues.type_id')
            ->leftJoin('statuses as s', 's.id', '=', 'issues.status_id')
            ->leftJoin('priorities as p', 'p.id', '=', 'issues.priority_id')
            ->select([
                'issues.*',
                'it.name as type_name', 'it.key as type_key',
                's.name as status_name', 's.key as status_key', 's.category as status_category',
                'p.name as priority_name', 'p.key as priority_key', 'p.weight as priority_weight',
            ]);
    }
}
