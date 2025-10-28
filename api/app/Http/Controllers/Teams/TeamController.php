<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\{TeamStoreRequest, TeamUpdateRequest, TeamMemberRequest};
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Models\Teams\Team;
use App\Interfaces\Teams\TeamServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    public function __construct(
        private TeamServiceInterface $service,
        private PermissionServiceInterface $permissionService
    ) {}

    /**
     * Lister toutes les équipes
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('q'),
            'order_by' => $request->query('order_by'),
            'order_dir' => $request->query('order_dir'),
        ];
        $perPage = (int)($request->query('per_page', 20));

        $page = $this->service->getAllTeams($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $page,
            'message' => 'Teams retrieved successfully'
        ]);
    }

    /**
     * Afficher une équipe
     */
    public function show(Team $team): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.view', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de voir cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $team->load(['members', 'projects'])
            ->loadCount(['members', 'projects']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Team retrieved successfully'
        ]);
    }

    /**
     * Créer une équipe
     */
    public function store(TeamStoreRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Seuls les admins et super admins peuvent créer des équipes
        if (!$user->isSuperAdmin() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de créer une équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $team = $this->service->createTeam($request->validated());

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Team created successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour une équipe
     */
    public function update(TeamUpdateRequest $request, Team $team): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.update', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de modifier cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $updated = $this->service->updateTeam($team, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Team updated successfully'
        ]);
    }

    /**
     * Supprimer une équipe
     */
    public function destroy(Team $team): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.delete', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de supprimer cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->service->deleteTeam($team);

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Team deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }

    /**
     * Ajouter un membre à l'équipe
     */
    public function addMember(TeamMemberRequest $request, Team $team): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.manage_members', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->service->addMember(
            $team,
            $request->validated()['user_id'],
            $request->validated()['role']
        );

        $team->load(['members']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Member added successfully'
        ]);
    }

    /**
     * Retirer un membre de l'équipe
     */
    public function removeMember(Request $request, Team $team, int $userId): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.manage_members', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->service->removeMember($team, $userId);

        $team->load(['members']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Member removed successfully'
        ]);
    }

    /**
     * Mettre à jour le rôle d'un membre
     */
    public function updateMemberRole(TeamMemberRequest $request, Team $team, int $userId): JsonResponse
    {
        $user = Auth::user();

        // Vérifier les permissions
        if (!$this->permissionService->userCanOnTeam($user, 'team.manage_members', $team)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de gérer les membres de cette équipe'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->service->updateMemberRole(
            $team,
            $userId,
            $request->validated()['role']
        );

        $team->load(['members']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Member role updated successfully'
        ]);
    }
}
