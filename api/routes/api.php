<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Ticketing\{ProjectController, IssueController};

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

Route::fallback(function () {
    return response()->json(['success' => false, 'message' => 'Route non trouvée'], 404);
});