<?php

namespace App\Models\Ticketing;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['issue_id', 'user_id', 'body'];

    public function issue()
    {
        return $this->belongsTo(Issue::class);
    }
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
