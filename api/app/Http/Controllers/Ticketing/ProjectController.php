<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{ProjectStoreRequest, ProjectUpdateRequest};
use App\Models\Ticketing\Project;
use Illuminate\Http\Request;
use App\Ticketing\Interfaces\ProjectServiceInterface as InterfacesProjectServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ProjectController extends Controller
{

    public function __construct(private InterfacesProjectServiceInterface $service) {}

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'team_id'   => $request->query('team_id'),
            'search'    => $request->query('q'),
            'order_by'  => $request->query('order_by'),
            'order_dir' => $request->query('order_dir'),
        ];
        $perPage = (int)($request->query('per_page', 20));

        $page = $this->service->getAllProjects($filters, $perPage);

        return response()->json($page);
    }

    public function show(Project $project): JsonResponse
    {
        $project->load(['team:id,slug,name', 'lead:id,name,email'])
            ->loadCount('issues');

        return response()->json($project);
    }

    public function store(ProjectStoreRequest $request): JsonResponse
    {
        $project = $this->service->createProject($request->validated());
        return response()->json($project, Response::HTTP_CREATED);
    }

    public function update(ProjectUpdateRequest $request, Project $project): JsonResponse
    {
        $updated = $this->service->updateProject($project, $request->validated());
        return response()->json($updated);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->service->deleteProject($project);
        return response()->json(null, 204);
    }
}
