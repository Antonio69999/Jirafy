<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{ProjectStoreRequest, ProjectUpdateRequest};
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Models\Ticketing\Project;
use Illuminate\Http\Request;
use App\Interfaces\Ticketing\ProjectServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
  public function __construct(
    private ProjectServiceInterface $service,
    private PermissionServiceInterface $permissionService
  ) {}

  /**
   * Lister tous les projets
   */
  public function index(Request $request): JsonResponse
  {
    $user = Auth::user();

    $filters = [
      'team_id'   => $request->query('team_id'),
      'search'    => $request->query('q'),
      'order_by'  => $request->query('order_by'),
      'order_dir' => $request->query('order_dir'),
    ];
    $perPage = (int)($request->query('per_page', 20));

    $page = $this->service->getAllProjects($filters, $perPage, $user);

    return response()->json([
      'success' => true,
      'data' => $page,
      'message' => 'Projects retrieved successfully'
    ]);
  }

  /**
   * Afficher un projet
   */
  public function show(Project $project): JsonResponse
  {
    $user = Auth::user();

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de voir ce projet'
      ], Response::HTTP_FORBIDDEN);
    }

    $project->load(['team:id,slug,name', 'lead:id,name,email'])
      ->loadCount('issues');

    return response()->json([
      'success' => true,
      'data' => $project,
      'message' => 'Project retrieved successfully'
    ]);
  }

  /**
   * Créer un projet
   */
  public function store(ProjectStoreRequest $request): JsonResponse
  {
    /** @var User $user */
    $user = Auth::user();

    // Vérifier si l'utilisateur peut créer des projets
    if (!$user->isSuperAdmin() && !$user->isAdmin()) {
      // Vérifier s'il est owner d'au moins une équipe
      $isTeamOwner = $user->teams()
        ->wherePivot('role', 'owner')
        ->exists();

      if (!$isTeamOwner) {
        return response()->json([
          'success' => false,
          'message' => 'Vous n\'avez pas la permission de créer un projet'
        ], Response::HTTP_FORBIDDEN);
      }
    }

    $project = $this->service->createProject($request->validated());

    return response()->json([
      'success' => true,
      'data' => $project,
      'message' => 'Project created successfully'
    ], Response::HTTP_CREATED);
  }

  /**
   * Mettre à jour un projet
   */
  public function update(ProjectUpdateRequest $request, Project $project): JsonResponse
  {
    $user = Auth::user();

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'project.update', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de modifier ce projet'
      ], Response::HTTP_FORBIDDEN);
    }

    $updated = $this->service->updateProject($project, $request->validated());

    return response()->json([
      'success' => true,
      'data' => $updated,
      'message' => 'Project updated successfully'
    ]);
  }

  /**
   * Supprimer un projet
   */
  public function destroy(Project $project): JsonResponse
  {
    $user = Auth::user();

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'project.delete', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de supprimer ce projet'
      ], Response::HTTP_FORBIDDEN);
    }

    $this->service->deleteProject($project);

    return response()->json([
      'success' => true,
      'data' => null,
      'message' => 'Project deleted successfully'
    ], Response::HTTP_NO_CONTENT);
  }
}
