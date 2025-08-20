<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Priority extends Model
{
    use HasFactory;

    protected $fillable = ['key','name','weight'];

    public function issues()
    {
        return $this->hasMany(Issue::class, 'priority_id');
    }   
}
