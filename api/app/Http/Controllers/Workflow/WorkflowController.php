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

/**
 * @OA\Tag(
 *     name="Workflow",
 *     description="Gestion des workflows et transitions"
 * )
 */
class WorkflowController extends Controller
{
  public function __construct(
    private WorkflowServiceInterface $service,
    private PermissionServiceInterface $permissionService
  ) {}

  /**
   * @OA\Get(
   *     path="/api/issues/{issue}/transitions",
   *     summary="Récupérer les transitions disponibles pour une issue",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\Parameter(
   *         name="issue",
   *         in="path",
   *         required=true,
   *         description="ID de l'issue",
   *         @OA\Schema(type="integer")
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="Liste des transitions disponibles",
   *         @OA\JsonContent(
   *             @OA\Property(property="success", type="boolean", example=true),
   *             @OA\Property(
   *                 property="data",
   *                 type="array",
   *                 @OA\Items(ref="#/components/schemas/AvailableTransition")
   *             ),
   *             @OA\Property(property="message", type="string")
   *         )
   *     ),
   *     @OA\Response(
   *         response=403,
   *         description="Permission refusée"
   *     )
   * )
   */
  public function getAvailableTransitions(Issue $issue): JsonResponse
  {
    $user = Auth::user();

    if (!$this->permissionService->userCanOnProject($user, 'issue.view', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $transitions = $this->service->getAvailableTransitions($issue, $user);

    return response()->json([
      'success' => true,
      'data' => $transitions,
      'message' => 'Available transitions retrieved successfully'
    ]);
  }

  /**
   * @OA\Post(
   *     path="/api/issues/{issue}/transitions",
   *     summary="Effectuer une transition sur une issue",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\Parameter(
   *         name="issue",
   *         in="path",
   *         required=true,
   *         description="ID de l'issue",
   *         @OA\Schema(type="integer")
   *     ),
   *     @OA\RequestBody(
   *         required=true,
   *         @OA\JsonContent(
   *             required={"transition_id"},
   *             @OA\Property(
   *                 property="transition_id",
   *                 type="integer",
   *                 description="ID de la transition à effectuer",
   *                 example=1
   *             )
   *         )
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="Transition effectuée avec succès",
   *         @OA\JsonContent(
   *             @OA\Property(property="success", type="boolean", example=true),
   *             @OA\Property(property="data", ref="#/components/schemas/Issue"),
   *             @OA\Property(property="message", type="string")
   *         )
   *     ),
   *     @OA\Response(
   *         response=400,
   *         description="Transition non valide"
   *     ),
   *     @OA\Response(
   *         response=403,
   *         description="Permission refusée"
   *     )
   * )
   */
  public function performTransition(Request $request, Issue $issue): JsonResponse
  {
    $user = Auth::user();

    if (!$this->permissionService->userCanOnProject($user, 'workflow.transition', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $validated = $request->validate([
      'transition_id' => 'required|integer|exists:workflow_transitions,id',
    ]);

    try {
      $updatedIssue = $this->service->performTransition(
        $issue,
        $validated['transition_id'],
        $user
      );

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
   * @OA\Get(
   *     path="/api/projects/{project}/workflow/transitions",
   *     summary="Récupérer toutes les transitions d'un projet",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\Parameter(
   *         name="project",
   *         in="path",
   *         required=true,
   *         description="ID du projet",
   *         @OA\Schema(type="integer")
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="Liste des transitions du projet",
   *         @OA\JsonContent(
   *             @OA\Property(property="success", type="boolean", example=true),
   *             @OA\Property(
   *                 property="data",
   *                 type="array",
   *                 @OA\Items(ref="#/components/schemas/WorkflowTransition")
   *             )
   *         )
   *     )
   * )
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
   * @OA\Post(
   *     path="/api/workflow/transitions",
   *     summary="Créer une nouvelle transition",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\RequestBody(
   *         required=true,
   *         @OA\JsonContent(ref="#/components/schemas/TransitionCreate")
   *     ),
   *     @OA\Response(
   *         response=201,
   *         description="Transition créée avec succès",
   *         @OA\JsonContent(
   *             @OA\Property(property="success", type="boolean", example=true),
   *             @OA\Property(property="data", ref="#/components/schemas/WorkflowTransition"),
   *             @OA\Property(property="message", type="string")
   *         )
   *     ),
   *     @OA\Response(
   *         response=403,
   *         description="Permission refusée"
   *     ),
   *     @OA\Response(
   *         response=422,
   *         description="Erreur de validation"
   *     )
   * )
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
   * @OA\Delete(
   *     path="/api/workflow/transitions/{transition}",
   *     summary="Supprimer une transition",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\Parameter(
   *         name="transition",
   *         in="path",
   *         required=true,
   *         description="ID de la transition",
   *         @OA\Schema(type="integer")
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="Transition supprimée avec succès"
   *     ),
   *     @OA\Response(
   *         response=403,
   *         description="Permission refusée"
   *     ),
   *     @OA\Response(
   *         response=404,
   *         description="Transition non trouvée"
   *     )
   * )
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
   * @OA\Get(
   *     path="/api/projects/{project}/workflow/validate",
   *     summary="Valider le workflow d'un projet",
   *     tags={"Workflow"},
   *     security={{"bearerAuth":{}}},
   *     @OA\Parameter(
   *         name="project",
   *         in="path",
   *         required=true,
   *         description="ID du projet",
   *         @OA\Schema(type="integer")
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="Résultat de la validation",
   *         @OA\JsonContent(
   *             @OA\Property(property="success", type="boolean"),
   *             @OA\Property(property="data", ref="#/components/schemas/WorkflowValidation"),
   *             @OA\Property(property="message", type="string")
   *         )
   *     ),
   *     @OA\Response(
   *         response=422,
   *         description="Workflow invalide"
   *     )
   * )
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

  public function updateTransition(Request $request, WorkflowTransition $transition): JsonResponse
  {
    $user = Auth::user();
    $project = Project::findOrFail($transition->project_id);

    if (!$this->permissionService->userCanOnProject($user, 'workflow.manage', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Permission refusée'
      ], Response::HTTP_FORBIDDEN);
    }

    $validated = $request->validate([
      'name' => 'sometimes|string|max:255',
      'description' => 'sometimes|nullable|string',
      'from_status_id' => 'sometimes|integer|exists:statuses,id',
      'to_status_id' => 'sometimes|integer|exists:statuses,id',
      'conditions' => 'sometimes|nullable|array',
      'validators' => 'sometimes|nullable|array',
      'post_actions' => 'sometimes|nullable|array',
      'allowed_roles' => 'sometimes|nullable|array',
    ]);

    $transition->update($validated);

    return response()->json([
      'success' => true,
      'data' => $transition->fresh()->load(['fromStatus', 'toStatus']),
      'message' => 'Transition mise à jour avec succès'
    ]);
  }
}
