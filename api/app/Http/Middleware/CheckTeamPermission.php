<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Teams\Team;

class CheckTeamPermission
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

        $team = $request->route('team');

        switch ($permission) {
            case 'view':
                if (!$this->canViewTeam($user, $team)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;

            case 'edit':
            case 'update':
            case 'delete':
                if (!$this->canManageTeam($user, $team)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;

            case 'manage_members':
                if (!$this->canManageMembers($user, $team)) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;
        }

        return $next($request);
    }

    private function canViewTeam($user, Team $team): bool
    {
        // Admin peut voir toutes les teams
        if ($user->isAdmin()) {
            return true;
        }

        // Membre de la team peut la voir
        return $user->teams()->where('teams.id', $team->id)->exists();
    }

    private function canManageTeam($user, Team $team): bool
    {
        // Admin peut gérer toutes les teams
        if ($user->isAdmin()) {
            return true;
        }

        // Owner de la team peut la gérer
        return $user->teams()
            ->where('teams.id', $team->id)
            ->wherePivot('role', 'owner')
            ->exists();
    }

    private function canManageMembers($user, Team $team): bool
    {
        // Admin peut gérer les membres de toutes les teams
        if ($user->isAdmin()) {
            return true;
        }

        // Owner ou Admin de la team peut gérer les membres
        return $user->teams()
            ->where('teams.id', $team->id)
            ->wherePivotIn('role', ['owner', 'admin'])
            ->exists();
    }
}
