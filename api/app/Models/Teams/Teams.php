<?php

namespace App\Models\Teams;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['slug','name','description'];

    public function members()
    {
        return $this->belongsToMany(\App\Models\User::class, 'team_users')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function projects()
    {
        return $this->hasMany(\App\Models\Ticketing\Project::class);
    }
}
