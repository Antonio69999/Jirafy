<?php

namespace App\Interfaces\Permission;

use App\Models\Auth\User;
use App\Models\Ticketing\{Project, Issue};
use App\Models\Teams\Team;

interface PermissionServiceInterface
{
    /**
     * Vérifier si un utilisateur a une permission sur un projet
     */
    public function userCanOnProject(User $user, string $permission, Project $project): bool;

    /**
     * Vérifier si un utilisateur a une permission sur une équipe
     */
    public function userCanOnTeam(User $user, string $permission, Team $team): bool;

    /**
     * Vérifier si un utilisateur peut effectuer une transition de workflow
     */
    public function canTransition(User $user, Issue $issue, int $targetStatusId): bool;

    /**
     * Obtenir toutes les permissions d'un rôle dans un contexte
     */
    public function getRolePermissions(string $role, string $context): array;
}
