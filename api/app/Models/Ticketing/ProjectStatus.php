<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectStatus extends Model
{
    use HasFactory;

    protected $table = 'project_statuses';
    protected $fillable = ['project_id','status_id','position','is_default'];

    public function project() { return $this->belongsTo(Project::class); }
    public function status()  { return $this->belongsTo(Status::class); }
}
