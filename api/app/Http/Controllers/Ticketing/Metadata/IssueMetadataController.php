<?php

namespace App\Http\Controllers\Ticketing\Metadata;

use App\Http\Controllers\Controller;
use App\Models\Ticketing\IssueType;
use App\Models\Ticketing\Status;
use App\Models\Ticketing\Priority;
use Illuminate\Http\JsonResponse;

class IssueMetadataController extends Controller
{
    public function types(): JsonResponse
    {
        $types = IssueType::select(['id', 'key', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $types,
            'message' => 'Issue types retrieved successfully'
        ]);
    }

    public function statuses(): JsonResponse
    {
        $statuses = Status::select(['id', 'key', 'name', 'category'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $statuses,
            'message' => 'Statuses retrieved successfully'
        ]);
    }

    public function priorities(): JsonResponse
    {
        $priorities = Priority::select(['id', 'key', 'name', 'weight'])
            ->orderBy('weight')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $priorities,
            'message' => 'Priorities retrieved successfully'
        ]);
    }
}
