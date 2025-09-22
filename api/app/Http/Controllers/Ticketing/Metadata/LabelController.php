<?php

namespace App\Http\Controllers\Ticketing\Metadata;

use App\Http\Controllers\Controller;
use App\Models\Ticketing\Label;
use App\Models\Ticketing\Project;
use Illuminate\Http\JsonResponse;

class LabelController extends Controller
{
    public function index(): JsonResponse
    {
        $labels = Label::select(['id', 'name', 'color', 'project_id'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $labels,
            'message' => 'Labels retrieved successfully'
        ]);
    }

    public function projectLabels(Project $project): JsonResponse
    {
        $labels = Label::where('project_id', $project->id)
            ->select(['id', 'name', 'color', 'project_id'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $labels,
            'message' => 'Project labels retrieved successfully'
        ]);
    }
}
