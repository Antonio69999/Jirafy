<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        switch ($role) {
            case 'admin':
                if (!$user->isAdmin()) {
                    return response()->json(['message' => 'Accès refusé'], 403);
                }
                break;
            case 'project_create':
                if (!$this->canCreateProject($user)) {
                    return response()->json(['message' => 'Vous ne pouvez pas créer de projets'], 403);
                }
                break;
        }

        return $next($request);
    }

    private function canCreateProject($user): bool
    {
        return $user->isAdmin() || 
               $user->teams()->wherePivot('role', 'owner')->exists();
    }
}