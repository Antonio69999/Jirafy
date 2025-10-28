<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticketing\Project;
use App\Services\Permission\PermissionService;

class CheckProjectPermission
{
    public function __construct(private PermissionService $permissionService) {}

    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();
        $project = $request->route('project');

        // Super admin peut tout faire
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Mapper les anciennes permissions vers les nouvelles
        $permissionMapping = [
            'view' => 'project.view',
            'edit' => 'project.update',
            'delete' => 'project.delete',
            'manage_members' => 'project.manage_members',
        ];

        $mappedPermission = $permissionMapping[$permission] ?? $permission;

        // Vérifier via le PermissionService
        if (!$this->permissionService->userCanOnProject($user, $mappedPermission, $project)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return $next($request);
    }
}
