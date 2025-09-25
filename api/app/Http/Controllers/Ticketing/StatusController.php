<?php

namespace App\Http\Controllers\Ticketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticketing\{StatusStoreRequest, StatusUpdateRequest};
use App\Models\Ticketing\Status;
use Illuminate\Http\Request;
use App\Interfaces\Ticketing\StatusServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class StatusController extends Controller
{
    public function __construct(private StatusServiceInterface $service) {}

    /**
     * Lister tous les statuts
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'category' => $request->query('category'),
            'search' => $request->query('q'),
            'order_by' => $request->query('order_by'),
            'order_dir' => $request->query('order_dir'),
        ];
        $perPage = (int)($request->query('per_page', 20));

        $page = $this->service->getAllStatuses($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $page,
            'message' => 'Statuses retrieved successfully'
        ]);
    }

    /**
     * Afficher un statut par ID
     */
    public function show(Status $status): JsonResponse
    {
        $status->loadCount('issues');

        return response()->json([
            'success' => true,
            'data' => $status,
            'message' => 'Status retrieved successfully'
        ]);
    }

    /**
     * Afficher un statut par clé
     */
    public function showByKey(string $key): JsonResponse
    {
        $status = $this->service->getStatusByKey($key);

        if (!$status) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Status not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $status,
            'message' => 'Status retrieved successfully'
        ]);
    }

    /**
     * Créer un nouveau statut
     */
    public function store(StatusStoreRequest $request): JsonResponse
    {
        $status = $this->service->createStatus($request->validated());

        return response()->json([
            'success' => true,
            'data' => $status,
            'message' => 'Status created successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Mettre à jour un statut
     */
    public function update(StatusUpdateRequest $request, Status $status): JsonResponse
    {
        $updated = $this->service->updateStatus($status, $request->validated());

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Status updated successfully'
        ]);
    }

    /**
     * Supprimer un statut
     */
    public function destroy(Status $status): JsonResponse
    {
        try {
            $this->service->deleteStatus($status);

            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Status deleted successfully'
            ], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage()
            ], Response::HTTP_CONFLICT);
        }
    }

    /**
     * Récupérer tous les statuts disponibles (simple liste)
     */
    public function available(): JsonResponse
    {
        $statuses = $this->service->getAvailableStatuses();

        return response()->json([
            'success' => true,
            'data' => $statuses,
            'message' => 'Available statuses retrieved successfully'
        ]);
    }
}
