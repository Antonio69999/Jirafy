<?php

namespace App\Services\Ticketing;

use App\Models\Ticketing\Project;
use App\Models\Ticketing\ProjectUser;
use Illuminate\Support\Collection;

class ProjectMemberService
{
    /**
     * Ajouter un membre au projet
     */
    public function addMember(Project $project, int $userId, string $role = 'contributor'): void
    {
        ProjectUser::updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $userId],
            ['role' => $role]
        );
    }

    /**
     * Retirer un membre du projet
     */
    public function removeMember(Project $project, int $userId): void
    {
        ProjectUser::where('project_id', $project->id)
            ->where('user_id', $userId)
            ->delete();
    }

    /**
     * Changer le rôle d'un membre
     */
    public function updateMemberRole(Project $project, int $userId, string $role): void
    {
        ProjectUser::where('project_id', $project->id)
            ->where('user_id', $userId)
            ->update(['role' => $role]);
    }

    /**
     * Récupérer tous les membres du projet (directs + via team)
     */
    public function getAllMembers(Project $project): Collection
    {
        // Charger la relation team si elle existe
        if (!$project->relationLoaded('team')) {
            $project->load('team');
        }

        // Membres directs du projet
        $directMembers = $project->members()
            ->select('users.id', 'users.name', 'users.email', 'users.avatar')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'role' => $user->pivot->role,
                    'source' => 'project',
                ];
            });

        // Si le projet a une team, récupérer ses membres aussi
        $teamMembers = collect([]);
        if ($project->team_id && $project->team) {
            $teamMembers = $project->team->members()
                ->select('users.id', 'users.name', 'users.email', 'users.avatar')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'role' => $user->pivot->role,
                        'source' => 'team',
                    ];
                });
        }

        // Fusionner en évitant les doublons (priorité aux membres directs)
        return $directMembers->concat(
            $teamMembers->filter(function ($teamMember) use ($directMembers) {
                return !$directMembers->contains('id', $teamMember['id']);
            })
        );
    }

    /**
     * Vérifier si un utilisateur a accès au projet
     */
    public function hasAccess(Project $project, int $userId): bool
    {
        // Membre direct du projet
        if ($project->members()->where('users.id', $userId)->exists()) {
            return true;
        }

        // Membre de la team du projet
        if ($project->team_id) {
            // Charger la relation team si nécessaire
            if (!$project->relationLoaded('team')) {
                $project->load('team');
            }

            if ($project->team) {
                return $project->team->members()->where('users.id', $userId)->exists();
            }
        }

        return false;
    }
}
