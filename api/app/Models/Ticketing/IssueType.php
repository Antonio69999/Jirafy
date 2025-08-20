<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueType extends Model
{
    use HasFactory;

    protected $fillable = ['key','name'];

    public function issues()
    {
        return $this->hasMany(Issue::class, 'type_id');
    }
}
