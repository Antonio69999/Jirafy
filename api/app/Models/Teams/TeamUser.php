<?php

namespace App\Models\Teams;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class TeamUser extends Model
{
    protected $table = 'team_users';
    protected $fillable = ['team_id', 'user_id', 'role'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
