<?php

namespace App\Models\Teams;

use Illuminate\Database\Eloquent\Model;

class TeamUser extends Model
{
    protected $table = 'team_users';
    protected $fillable = ['team_id','user_id','role'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
