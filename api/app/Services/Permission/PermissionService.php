<?php

namespace App\Services\Permission;

use App\Interfaces\Permission\PermissionServiceInterface;
use App\Models\Auth\User;
use App\Models\Ticketing\{Project, Issue};
use App\Models\Teams\Team;
use Illuminate\Support\Facades\DB;

class PermissionService implements PermissionServiceInterface
{
    /**
     * Vérifier si un utilisateur a une permission sur un projet
     */
    public function userCanOnProject(User $user, string $permission, Project $project): bool
    {
        // Super admin peut tout faire
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Récupérer le rôle de l'utilisateur dans le projet
        $projectRole = $user->projects()
            ->where('project_id', $project->id)
            ->first()?->pivot->role;

        if (!$projectRole) {
            // Vérifier via l'équipe du projet
            if ($project->team_id) {
                $teamRole = $user->teams()
                    ->where('team_id', $project->team_id)
                    ->first()?->pivot->role;

                // Mapper les rôles d'équipe aux rôles de projet
                $projectRole = $this->mapTeamRoleToProjectRole($teamRole);
            }
        }

        if (!$projectRole) {
            return false;
        }

        // Vérifier si le rôle a la permission
        return $this->hasPermission($projectRole, $permission, 'project');
    }

    /**
     * Vérifier si un utilisateur a une permission sur une équipe
     */
    public function userCanOnTeam(User $user, string $permission, Team $team): bool
    {
        // Super admin peut tout faire
        if ($user->isSuperAdmin()) {
            return true;
        }

        // Récupérer le rôle de l'utilisateur dans l'équipe
        $teamRole = $user->teams()
            ->where('team_id', $team->id)
            ->first()?->pivot->role;

        if (!$teamRole) {
            return false;
        }

        // Mapper le rôle d'équipe vers le rôle normalisé
        $normalizedRole = $this->normalizeTeamRole($teamRole);

        // Vérifier si le rôle a la permission
        return $this->hasPermission($normalizedRole, $permission, 'team');
    }

    /**
     * Vérifier si un utilisateur peut effectuer une transition de workflow
     */
    public function canTransition(User $user, Issue $issue, int $targetStatusId): bool
    {
        // Charger le projet si pas déjà fait
        if (!$issue->relationLoaded('project')) {
            $issue->load('project');
        }

        // Vérifier la permission de base
        if (!$this->userCanOnProject($user, 'workflow.transition', $issue->project)) {
            return false;
        }

        // TODO: Ajouter la logique de transitions autorisées
        // (ce sera la prochaine étape avec le système de workflow)

        return true;
    }

    /**
     * Obtenir toutes les permissions d'un rôle dans un contexte
     */
    public function getRolePermissions(string $role, string $context): array
    {
        return DB::table('role_permissions')
            ->join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role', $role)
            ->where('role_permissions.context', $context)
            ->pluck('permissions.name')
            ->toArray();
    }

    /**
     * Vérifier si un utilisateur est owner d'un projet (pour compatibilité)
     */
    public function isProjectOwner(User $user, Project $project): bool
    {
        // Lead du projet est considéré comme owner
        if ($project->lead_user_id === $user->id) {
            return true;
        }

        // Admin du projet
        $projectRole = $user->projects()
            ->where('project_id', $project->id)
            ->first()?->pivot->role;

        if ($projectRole === 'admin') {
            return true;
        }

        // Owner de l'équipe du projet
        if ($project->team_id) {
            $teamRole = $user->teams()
                ->where('team_id', $project->team_id)
                ->first()?->pivot->role;

            return $teamRole === 'owner';
        }

        return false;
    }

    /**
     * Vérifier si un rôle a une permission dans un contexte
     */
    private function hasPermission(string $role, string $permission, string $context): bool
    {
        return DB::table('role_permissions')
            ->join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->where('role_permissions.role', $role)
            ->where('permissions.name', $permission)
            ->where('role_permissions.context', $context)
            ->exists();
    }

    /**
     * Mapper les rôles d'équipe vers les rôles de projet
     */
    private function mapTeamRoleToProjectRole(?string $teamRole): ?string
    {
        return match ($teamRole) {
            'owner' => 'admin',
            'admin' => 'manager',
            'member' => 'contributor',
            'viewer' => 'viewer',
            default => null,
        };
    }

    /**
     * Normaliser les rôles d'équipe pour la vérification de permissions
     */
    private function normalizeTeamRole(?string $teamRole): ?string
    {
        return match ($teamRole) {
            'owner' => 'admin',
            'admin' => 'manager',
            'member' => 'contributor',
            'viewer' => 'viewer',
            default => null,
        };
    }
}
