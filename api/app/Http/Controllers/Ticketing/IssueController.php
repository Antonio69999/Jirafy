<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{IssueStoreRequest, IssueUpdateRequest};
use App\Models\Ticketing\{Issue, Project};
use Illuminate\Http\Request;
use App\Interfaces\Ticketing\IssueServiceInterface;
use App\Interfaces\Permission\PermissionServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class IssueController extends Controller
{
  public function __construct(
    private IssueServiceInterface $service,
    private PermissionServiceInterface $permissionService
  ) {}

  /**
   * Lister toutes les issues (avec filtres optionnels)
   */
  public function index(Request $request): JsonResponse
  {
    $filters = [
      'project_id' => $request->query('project_id'),
      'status_id' => $request->query('status_id'),
      'type_id' => $request->query('type_id'),
      'priority_id' => $request->query('priority_id'),
      'assignee_id' => $request->query('assignee_id'),
      'search' => $request->query('q'),
      'order_by' => $request->query('order_by'),
      'order_dir' => $request->query('order_dir'),
    ];
    $perPage = (int)($request->query('per_page', 20));

    $page = $this->service->getAllIssues($filters, $perPage);

    return response()->json([
      'success' => true,
      'data' => $page,
      'message' => 'Issues retrieved successfully'
    ]);
  }

  /**
   * Lister les issues d'un projet spécifique
   */
  public function projectIssues(Request $request, int $projectId): JsonResponse
  {
    $user = Auth::user();
    $project = Project::findOrFail($projectId);

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de voir ce projet'
      ], Response::HTTP_FORBIDDEN);
    }

    $filters = [
      'status_id' => $request->query('status_id'),
      'type_id' => $request->query('type_id'),
      'priority_id' => $request->query('priority_id'),
      'assignee_id' => $request->query('assignee_id'),
      'search' => $request->query('q'),
      'order_by' => $request->query('order_by'),
      'order_dir' => $request->query('order_dir'),
    ];
    $perPage = (int)($request->query('per_page', 20));

    $page = $this->service->getProjectIssues($projectId, $filters, $perPage);

    return response()->json([
      'success' => true,
      'data' => $page,
      'message' => 'Project issues retrieved successfully'
    ]);
  }

  /**
   * Afficher une issue par ID
   */
  public function show(Issue $issue): JsonResponse
  {
    $user = Auth::user();

    if (!$issue->relationLoaded('project')) {
      $issue->load('project');
    }

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'issue.view', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de voir cette issue'
      ], Response::HTTP_FORBIDDEN);
    }

    $issue->load([
      'project:id,key,name',
      'type:id,key,name',
      'status:id,key,name,category',
      'priority:id,key,name,weight',
      'reporter:id,name,email',
      'assignee:id,name,email',
      'labels:id,name,color',
      'comments.author:id,name,email'
    ]);

    return response()->json([
      'success' => true,
      'data' => $issue,
      'message' => 'Issue retrieved successfully'
    ]);
  }

  /**
   * Afficher une issue par clé (ex: PROJ-123)
   */
  public function showByKey(string $key): JsonResponse
  {
    $user = Auth::user();
    $issue = $this->service->getIssueByKey($key);

    if (!$issue) {
      return response()->json([
        'success' => false,
        'data' => null,
        'message' => 'Issue not found'
      ], Response::HTTP_NOT_FOUND);
    }

    if (!$issue->relationLoaded('project')) {
      $issue->load('project');
    }

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'issue.view', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de voir cette issue'
      ], Response::HTTP_FORBIDDEN);
    }

    return response()->json([
      'success' => true,
      'data' => $issue,
      'message' => 'Issue retrieved successfully'
    ]);
  }

  /**
   * Créer une nouvelle issue
   */
  public function store(IssueStoreRequest $request): JsonResponse
  {
    $user = Auth::user();
    $project = Project::findOrFail($request->validated()['project_id']);

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'issue.create', $project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de créer une issue dans ce projet'
      ], Response::HTTP_FORBIDDEN);
    }

    $issue = $this->service->createIssue($request->validated());

    return response()->json([
      'success' => true,
      'data' => $issue,
      'message' => 'Issue created successfully'
    ], Response::HTTP_CREATED);
  }

  /**
   * Mettre à jour une issue
   */
  public function update(IssueUpdateRequest $request, Issue $issue): JsonResponse
  {
    $user = Auth::user();

    if (!$issue->relationLoaded('project')) {
      $issue->load('project');
    }

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'issue.update', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de modifier cette issue'
      ], Response::HTTP_FORBIDDEN);
    }

    $updated = $this->service->updateIssue($issue, $request->validated());

    return response()->json([
      'success' => true,
      'data' => $updated,
      'message' => 'Issue updated successfully'
    ]);
  }

  /**
   * Supprimer une issue
   */
  public function destroy(Issue $issue): JsonResponse
  {
    $user = Auth::user();

    if (!$issue->relationLoaded('project')) {
      $issue->load('project');
    }

    // Vérifier les permissions
    if (!$this->permissionService->userCanOnProject($user, 'issue.delete', $issue->project)) {
      return response()->json([
        'success' => false,
        'message' => 'Vous n\'avez pas la permission de supprimer cette issue'
      ], Response::HTTP_FORBIDDEN);
    }

    $this->service->deleteIssue($issue);

    return response()->json([
      'success' => true,
      'data' => null,
      'message' => 'Issue deleted successfully'
    ], Response::HTTP_NO_CONTENT);
  }

  /**
   * Récupérer uniquement les tickets de l'utilisateur connecté (pour les clients)
   */
  public function myTickets(Request $request): JsonResponse
  {
    $user = Auth::user();

    if ($user->isCustomer()) {
      // Les clients ne voient que LEURS tickets
      $issues = Issue::where('reporter_id', $user->id)
        ->with(['project:id,key,name', 'status', 'priority', 'assignee', 'reporter'])
        ->withCount('comments')
        ->orderBy('created_at', 'desc')
        ->paginate(20);
    } else {
      // Les utilisateurs internes voient tous les tickets assignés ou créés par eux
      $issues = Issue::where(function ($query) use ($user) {
        $query->where('reporter_id', $user->id)
          ->orWhere('assignee_id', $user->id);
      })
        ->with(['project:id,key,name', 'status', 'priority', 'assignee', 'reporter'])
        ->withCount('comments')
        ->orderBy('created_at', 'desc')
        ->paginate(20);
    }

    return response()->json([
      'success' => true,
      'data' => $issues,
      'message' => 'Your tickets retrieved successfully'
    ]);
  }
}
