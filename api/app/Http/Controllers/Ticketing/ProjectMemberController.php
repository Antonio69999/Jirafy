<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Models\Ticketing\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProjectMemberController extends Controller
{
    public function __construct(
        private PermissionServiceInterface $permissionService
    ) {}

    /**
     * Lister les membres d'un projet
     */
    public function index(Project $project): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de voir ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        $members = $project->members()->get();

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Project members retrieved successfully'
        ]);
    }

    /**
     * Ajouter un membre au projet
     */
    public function store(Request $request, Project $project): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnProject($user, 'project.manage_members', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role' => ['required', 'string', 'in:admin,manager,contributor,viewer']
        ]);

        // Vérifier si le membre existe déjà
        if ($project->members()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cet utilisateur est déjà membre du projet'
            ], Response::HTTP_CONFLICT);
        }

        $project->members()->attach($validated['user_id'], ['role' => $validated['role']]);

        $members = $project->members()->get();

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Member added successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour le rôle d'un membre
     */
    public function update(Request $request, Project $project, int $userId): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnProject($user, 'project.manage_members', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,manager,contributor,viewer']
        ]);

        if (!$project->members()->where('user_id', $userId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cet utilisateur n\'est pas membre du projet'
            ], Response::HTTP_NOT_FOUND);
        }

        $project->members()->updateExistingPivot($userId, ['role' => $validated['role']]);

        $members = $project->members()->get();

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Member role updated successfully'
        ]);
    }

    /**
     * Retirer un membre du projet
     */
    public function destroy(Project $project, int $userId): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnProject($user, 'project.manage_members', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        if (!$project->members()->where('user_id', $userId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cet utilisateur n\'est pas membre du projet'
            ], Response::HTTP_NOT_FOUND);
        }

        $project->members()->detach($userId);

        $members = $project->members()->get();

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Member removed successfully'
        ]);
    }
}
