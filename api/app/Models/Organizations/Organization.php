<?php

namespace App\Models\Organizations;

use App\Models\Auth\User;
use App\Models\Ticketing\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'logo',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Clients de l'organisation
     */
    public function customers()
    {
        return $this->hasMany(User::class)->where('role', 'customer');
    }

    /**
     * Projets associés à l'organisation
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'organization_projects')
            ->withTimestamps();
    }
}
