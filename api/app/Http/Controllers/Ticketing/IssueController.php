<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{IssueStoreRequest, IssueUpdateRequest};
use App\Models\Ticketing\Issue;
use Illuminate\Http\Request;
use App\Interfaces\Ticketing\IssueServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class IssueController extends Controller
{
    public function __construct(private IssueServiceInterface $service) {}

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
        $issue = $this->service->getIssueByKey($key);

        if (!$issue) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Issue not found'
            ], Response::HTTP_NOT_FOUND);
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
        $this->service->deleteIssue($issue);

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Issue deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}