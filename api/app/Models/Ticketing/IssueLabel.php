<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueLabel extends Model
{
    use HasFactory;

    protected $table = 'issue_label';
    protected $fillable = ['issue_id','label_id'];

    public function issue() { return $this->belongsTo(Issue::class); }
    public function label() { return $this->belongsTo(Label::class); }
}
