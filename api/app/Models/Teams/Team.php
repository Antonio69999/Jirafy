<?php

namespace App\Models\Teams;

use App\Models\Auth\User;
use App\Models\Ticketing\Project;
use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model

{
    use HasFactory;

    protected $fillable = ['slug', 'name', 'description'];

    /**
     * Membres de l'équipe
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Projets de l'équipe
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Créer une nouvelle instance de factory pour le modèle.
     */
    protected static function newFactory()
    {
        return TeamFactory::new();
    }
}