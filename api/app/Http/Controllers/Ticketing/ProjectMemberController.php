<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Models\Ticketing\Project;
use App\Services\Ticketing\ProjectMemberService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectMemberController extends Controller
{
    public function __construct(private ProjectMemberService $service) {}

    /**
     * Liste tous les membres du projet
     */
    public function index(Project $project): JsonResponse
    {
        $project->load('team');

        $members = $this->service->getAllMembers($project);

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
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role' => ['required', 'string', 'in:admin,manager,contributor,viewer'],
        ]);

        $this->service->addMember(
            $project,
            $validated['user_id'],
            $validated['role']
        );

        // Recharger le projet avec les relations
        $project->load('team');
        $members = $this->service->getAllMembers($project);

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Member added successfully'
        ]);
    }

    /**
     * Modifier le rôle d'un membre
     */
    public function update(Request $request, Project $project, int $userId): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,manager,contributor,viewer'],
        ]);

        $this->service->updateMemberRole($project, $userId, $validated['role']);

        // Recharger le projet avec les relations
        $project->load('team');
        $members = $this->service->getAllMembers($project);

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
        $this->service->removeMember($project, $userId);

        // Recharger le projet avec les relations
        $project->load('team');
        $members = $this->service->getAllMembers($project);

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Member removed successfully'
        ]);
    }
}
