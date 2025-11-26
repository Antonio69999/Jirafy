<?php

namespace App\Http\Controllers\Workflow;

use App\Http\Controllers\Controller;
use App\Interfaces\Workflow\WorkflowServiceInterface;
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Models\Ticketing\{Issue, Project};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Workflow\StoreTransitionRequest;
use App\Models\Workflow\WorkflowTransition;

class WorkflowController extends Controller
{
  public function __construct(
    private WorkflowServiceInterface $service,
    private PermissionServiceInterface $permissionService
  ) {}

  /**
   * Récupérer les transitions disponibles pour une issue
   */
  public function getAvailableTransitions(Issue $issue): JsonResponse
  {
    $user = Auth::user();
    $issue->load('project');

    if (!$this->permissionService->userCanOnProject($user, 'issue.view', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $transitions = $this->service->getAvailableTransitions($issue);

    return response()->json([
      'success' => true,
      'data' => $transitions,
      'message' => 'Transitions retrieved successfully'
    ]);
  }

  /**
   * Effectuer une transition
   */
  public function performTransition(Request $request, Issue $issue): JsonResponse
  {
    $user = Auth::user();
    $issue->load('project');

    if (!$this->permissionService->userCanOnProject($user, 'workflow.transition', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $transitionId = $request->input('transition_id');

    try {
      $updatedIssue = $this->service->performTransition($issue, $transitionId);

      return response()->json([
        'success' => true,
        'data' => $updatedIssue,
        'message' => 'Transition effectuée avec succès'
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => $e->getMessage()
      ], Response::HTTP_BAD_REQUEST);
    }
  }

  /**
   * Récupérer toutes les transitions d'un projet
   */
  public function getProjectTransitions(Project $project): JsonResponse
  {
    $user = Auth::user();

    if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $transitions = $this->service->getProjectTransitions($project->id);

    return response()->json([
      'success' => true,
      'data' => $transitions,
      'message' => 'Project transitions retrieved successfully'
    ]);
  }

  /**
   * Créer une transition
   */
  public function createTransition(Request $request): JsonResponse
  {
    $user = Auth::user();
    $projectId = $request->input('project_id');
    $project = Project::findOrFail($projectId);

    if (!$this->permissionService->userCanOnProject($user, 'workflow.manage', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $validated = $request->validate([
      'project_id' => 'required|integer|exists:projects,id',
      'from_status_id' => 'required|integer|exists:statuses,id',
      'to_status_id' => 'required|integer|exists:statuses,id',
      'name' => 'required|string|max:255',
      'description' => 'nullable|string',
    ]);

    $transition = $this->service->createTransition($validated);

    return response()->json([
      'success' => true,
      'data' => $transition->load(['fromStatus', 'toStatus']),
      'message' => 'Transition créée avec succès'
    ], Response::HTTP_CREATED);
  }

  /**
   * Supprimer une transition
   */
  public function deleteTransition(WorkflowTransition $transition): JsonResponse
  {
    $user = Auth::user();
    $project = Project::findOrFail($transition->project_id);

    if (!$this->permissionService->userCanOnProject($user, 'workflow.manage', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $this->service->deleteTransition($transition);

    return response()->json([
      'success' => true,
      'message' => 'Transition supprimée avec succès'
    ]);
  }

  /**
   * Valider le workflow d'un projet
   */
  public function validateWorkflow(Project $project): JsonResponse
  {
    $user = Auth::user();

    if (!$this->permissionService->userCanOnProject($user, 'workflow.manage', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $validation = $this->service->validateWorkflow($project);

    return response()->json([
      'success' => true,
      'data' => $validation,
      'message' => $validation['valid']
        ? 'Workflow valide'
        : 'Le workflow contient des erreurs'
    ], $validation['valid'] ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY);
  }
}
