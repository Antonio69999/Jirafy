<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Ticketing\{ProjectController, IssueController};
use App\Http\Controllers\Ticketing\Metadata\{LabelController, IssueMetadataController};
use App\Http\Controllers\Ticketing\StatusController;
use App\Http\Controllers\Teams\TeamController;


// Routes d'authentification - pas d'authentification requise
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('refresh',  [AuthController::class, 'refresh']);
    Route::post('logout',   [AuthController::class, 'logout']);
    Route::get('me',        [AuthController::class, 'me']);
});

// Routes protégées par authentification
Route::middleware('auth:api')->group(function () {

    // Users
    Route::get('users', [UserController::class, 'index']);

    // Routes des équipes
    Route::prefix('teams')->group(function () {
        Route::get('/', [TeamController::class, 'index']);
        Route::get('/{team}', [TeamController::class, 'show']);

        Route::middleware('check.role:admin')->group(function () {
            Route::post('/', [TeamController::class, 'store']);
            Route::put('/{team}', [TeamController::class, 'update']);
            Route::delete('/{team}', [TeamController::class, 'destroy']);
        });

        // Gestion des membres
        Route::post('/{team}/members', [TeamController::class, 'addMember'])
            ->middleware('check.role:admin');
        Route::delete('/{team}/members/{userId}', [TeamController::class, 'removeMember'])
            ->middleware('check.role:admin');
        Route::put('/{team}/members/{userId}', [TeamController::class, 'updateMemberRole'])
            ->middleware('check.role:admin');
    });

    // Labels globaux
    Route::get('labels', [LabelController::class, 'index']);

    // Issue metadata
    Route::get('issue-types', [IssueMetadataController::class, 'types']);
    Route::get('statuses', [IssueMetadataController::class, 'statuses']);
    Route::get('priorities', [IssueMetadataController::class, 'priorities']);

    // Route status
    Route::prefix('statuses')->group(function () {
        Route::get('/', [StatusController::class, 'index']);
        Route::get('/available', [StatusController::class, 'available']);
        Route::get('/key/{key}', [StatusController::class, 'showByKey']);
        Route::get('/{status}', [StatusController::class, 'show']);

        Route::middleware('check.role:admin')->group(function () {
            Route::post('/', [StatusController::class, 'store']);
            Route::put('/{status}', [StatusController::class, 'update']);
            Route::delete('/{status}', [StatusController::class, 'destroy']);
        });
    });

    // Routes des projets
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::get('/{project}', [ProjectController::class, 'show']);

        Route::middleware('check.role:project_create')->group(function () {
            Route::post('/', [ProjectController::class, 'store']);
        });

        Route::middleware('check.role:admin')->group(function () {
            Route::put('/{project}', [ProjectController::class, 'update']);
            Route::delete('/{project}', [ProjectController::class, 'destroy']);
        });

        // Issues d'un projet spécifique
        Route::get('/{project}/issues', [IssueController::class, 'projectIssues']);

        // Labels spécifiques à un projet
        Route::get('/{project}/labels', [LabelController::class, 'projectLabels']);
    });

    // Routes des issues
    Route::prefix('issues')->group(function () {
        Route::get('/', [IssueController::class, 'index']);
        Route::post('/', [IssueController::class, 'store']);
        Route::get('/key/{key}', [IssueController::class, 'showByKey']);
        Route::get('/{issue}', [IssueController::class, 'show']);
        Route::put('/{issue}', [IssueController::class, 'update']);
        Route::delete('/{issue}', [IssueController::class, 'destroy']);
    });
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'database' => 'connected'
    ]);
});

Route::fallback(function () {
    return response()->json(['success' => false, 'message' => 'Route non trouvée'], 404);
});
