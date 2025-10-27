<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\{TeamStoreRequest, TeamUpdateRequest, TeamMemberRequest};
use App\Models\Teams\Team;
use App\Interfaces\Teams\TeamServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TeamController extends Controller
{
    public function __construct(private TeamServiceInterface $service) {}

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

    public function show(Team $team): JsonResponse
    {
        $team->load(['members', 'projects'])
            ->loadCount(['members', 'projects']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Team retrieved successfully'
        ]);
    }

    public function store(TeamStoreRequest $request): JsonResponse
    {
        $team = $this->service->createTeam($request->validated());

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Team created successfully'
        ], Response::HTTP_CREATED);
    }

    public function update(TeamUpdateRequest $request, Team $team): JsonResponse
    {
        $updated = $this->service->updateTeam($team, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Team updated successfully'
        ]);
    }

    public function destroy(Team $team): JsonResponse
    {
        $this->service->deleteTeam($team);

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Team deleted successfully'
        ]);
    }

    public function addMember(TeamMemberRequest $request, Team $team): JsonResponse
    {
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

    public function removeMember(Request $request, Team $team, int $userId): JsonResponse
    {
        $this->service->removeMember($team, $userId);

        $team->load(['members']);

        return response()->json([
            'success' => true,
            'data' => $team,
            'message' => 'Member removed successfully'
        ]);
    }

    public function updateMemberRole(TeamMemberRequest $request, Team $team, int $userId): JsonResponse
    {
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
