<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticketing\Project;

class CheckProjectPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();

        // Super admin peut tout faire
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $project = $request->route('project');

        switch ($permission) {
            case 'view':
                if (!$this->canViewProject($user, $project)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;

            case 'edit':
                if (!$this->canEditProject($user, $project)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;

            case 'manage_members':
                if (!$this->canManageMembers($user, $project)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;
        }

        return $next($request);
    }

    private function canViewProject($user, Project $project): bool
    {
        // Admin peut voir tous les projets
        if ($user->isAdmin()) {
            return true;
        }

        // Si le projet a une team, vérifier l'appartenance
        if ($project->team_id) {
            $isMemberOfTeam = $user->teams()
                ->where('teams.id', $project->team_id)
                ->exists();
            
            if ($isMemberOfTeam) {
                return true;
            }
        }

        // Vérifier si l'utilisateur est membre du projet directement
        return $user->projects()
            ->where('projects.id', $project->id)
            ->exists();
    }

    private function canEditProject($user, Project $project): bool
    {
        // Admin peut modifier tous les projets
        if ($user->isAdmin()) {
            return true;
        }

        // Lead du projet peut modifier
        if ($project->lead_user_id === $user->id) {
            return true;
        }

        // Owner/Admin de la team peut modifier
        if ($project->team_id) {
            return $user->teams()
                ->where('teams.id', $project->team_id)
                ->wherePivotIn('role', ['owner', 'admin'])
                ->exists();
        }

        // Admin/Manager du projet peut modifier
        return $user->projects()
            ->where('projects.id', $project->id)
            ->wherePivotIn('role', ['admin', 'manager'])
            ->exists();
    }

    private function canManageMembers($user, Project $project): bool
    {
        return $this->canEditProject($user, $project);
    }
}