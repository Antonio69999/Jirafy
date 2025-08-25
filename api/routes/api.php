<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Ticketing\ProjectController;

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
    });
    // Autres routes protégées par authentification
});

Route::fallback(function () {
    return response()->json(['success' => false, 'message' => 'Route non trouvée'], 404);
});