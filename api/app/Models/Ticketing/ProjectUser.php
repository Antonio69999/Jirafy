<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectUser extends Model
{
    use HasFactory;

    protected $table = 'project_users';
    protected $fillable = ['project_id','user_id','role'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
