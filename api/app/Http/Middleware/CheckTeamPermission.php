<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Teams\Team;
use App\Services\Permission\PermissionService;

class CheckTeamPermission
{
    public function __construct(private PermissionService $permissionService) {}

    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();
        $team = $request->route('team');

        // Super admin peut tout faire
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Mapper les anciennes permissions vers les nouvelles
        $permissionMapping = [
            'view' => 'team.view',
            'edit' => 'team.update',
            'update' => 'team.update',
            'delete' => 'team.delete',
            'manage_members' => 'team.manage_members',
        ];

        $mappedPermission = $permissionMapping[$permission] ?? $permission;

        // Vérifier via le PermissionService
        if (!$this->permissionService->userCanOnTeam($user, $mappedPermission, $team)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return $next($request);
    }
}
