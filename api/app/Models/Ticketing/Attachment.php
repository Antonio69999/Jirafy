<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = ['issue_id','user_id','filename','mime_type','size','storage_path'];

    public function issue() { return $this->belongsTo(Issue::class); }
    public function user()  { return $this->belongsTo(\App\Models\User::class); }
}
