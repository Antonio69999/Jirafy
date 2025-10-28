<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Auth\User;
use App\Models\Teams\Team;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['team_id', 'key', 'name', 'description', 'lead_user_id', 'issue_seq'];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function lead()
    {
        return $this->belongsTo(User::class, 'lead_user_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'project_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function issues()
    {
        return $this->hasMany(Issue::class);
    }

    public function statuses()
    {
        return $this->belongsToMany(Status::class, 'project_statuses')
            ->withPivot(['position', 'is_default'])
            ->withTimestamps()
            ->orderBy('project_statuses.position');
    }

    public function labels()
    {
        return $this->hasMany(\App\Models\Ticketing\Label::class);
    }
}
