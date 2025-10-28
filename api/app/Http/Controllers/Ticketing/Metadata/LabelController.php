<?php

namespace App\Http\Controllers\Ticketing\Metadata;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{LabelStoreRequest, LabelUpdateRequest};
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Interfaces\Ticketing\LabelServiceInterface;
use App\Models\Ticketing\{Label, Project};
use App\Models\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class LabelController extends Controller
{
    public function __construct(
        private LabelServiceInterface $service,
        private PermissionServiceInterface $permissionService
    ) {}

    /**
     * Lister tous les labels (avec filtres)
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'project_id' => $request->query('project_id'),
            'global_only' => $request->query('global_only'),
            'search' => $request->query('q'),
            'order_by' => $request->query('order_by'),
            'order_dir' => $request->query('order_dir'),
        ];
        $perPage = (int)($request->query('per_page', 20));

        $page = $this->service->getAllLabels($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $page,
            'message' => 'Labels retrieved successfully'
        ]);
    }

    /**
     * Lister les labels d'un projet spécifique
     */
    public function projectLabels(Project $project, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Vérifier les permissions de voir le projet
        if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de voir ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        $filters = [
            'search' => $request->query('q'),
        ];
        $perPage = (int)($request->query('per_page', 20));

        $page = $this->service->getProjectLabels($project->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $page,
            'message' => 'Project labels retrieved successfully'
        ]);
    }

    /**
     * Récupérer les labels disponibles pour un projet (globaux + projet)
     */
    public function availableForProject(Project $project): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Vérifier les permissions de voir le projet
        if (!$this->permissionService->userCanOnProject($user, 'project.view', $project)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas la permission de voir ce projet'
            ], Response::HTTP_FORBIDDEN);
        }

        $labels = $this->service->getAvailableLabelsForProject($project->id);

        return response()->json([
            'success' => true,
            'data' => $labels,
            'message' => 'Available labels retrieved successfully'
        ]);
    }

    /**
     * Afficher un label
     */
    public function show(Label $label): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Si le label appartient à un projet, vérifier les permissions
        if ($label->project_id) {
            $label->load('project');
            if (!$this->permissionService->userCanOnProject($user, 'project.view', $label->project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de voir ce label'
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $label->load('project:id,key,name');

        return response()->json([
            'success' => true,
            'data' => $label,
            'message' => 'Label retrieved successfully'
        ]);
    }

    /**
     * Créer un nouveau label
     */
    public function store(LabelStoreRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validated();

        // Si le label est lié à un projet, vérifier les permissions
        if (!empty($data['project_id'])) {
            $project = Project::findOrFail($data['project_id']);

            if (!$this->permissionService->userCanOnProject($user, 'project.update', $project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de créer un label dans ce projet'
                ], Response::HTTP_FORBIDDEN);
            }
        } else {
            // Pour les labels globaux, seuls les admins peuvent créer
            if (!$user->isSuperAdmin() && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les administrateurs peuvent créer des labels globaux'
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $label = $this->service->createLabel($data);

        return response()->json([
            'success' => true,
            'data' => $label,
            'message' => 'Label created successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour un label
     */
    public function update(LabelUpdateRequest $request, Label $label): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Si le label appartient à un projet, vérifier les permissions
        if ($label->project_id) {
            $label->load('project');
            if (!$this->permissionService->userCanOnProject($user, 'project.update', $label->project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de modifier ce label'
                ], Response::HTTP_FORBIDDEN);
            }
        } else {
            // Pour les labels globaux, seuls les admins peuvent modifier
            if (!$user->isSuperAdmin() && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les administrateurs peuvent modifier des labels globaux'
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $updated = $this->service->updateLabel($label, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Label updated successfully'
        ]);
    }

    /**
     * Supprimer un label
     */
    public function destroy(Label $label): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Si le label appartient à un projet, vérifier les permissions
        if ($label->project_id) {
            $label->load('project');
            if (!$this->permissionService->userCanOnProject($user, 'project.update', $label->project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de supprimer ce label'
                ], Response::HTTP_FORBIDDEN);
            }
        } else {
            // Pour les labels globaux, seuls les admins peuvent supprimer
            if (!$user->isSuperAdmin() && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Seuls les administrateurs peuvent supprimer des labels globaux'
                ], Response::HTTP_FORBIDDEN);
            }
        }

        $this->service->deleteLabel($label);

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Label deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
