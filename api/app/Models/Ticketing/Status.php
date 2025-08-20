<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Status extends Model
{
    use HasFactory;

    protected $fillable = ['key','name','category'];

    public function issues()
    {
        return $this->hasMany(Issue::class, 'status_id');
    }
}
