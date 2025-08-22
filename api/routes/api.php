<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Ticketing\ProjectController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('refresh',  [AuthController::class, 'refresh']);
    Route::post('logout',   [AuthController::class, 'logout']);
    Route::get('me',        [AuthController::class, 'me']);
});

Route::apiResource('projects', ProjectController::class);

Route::fallback(function () {
    return response()->json(['success' => false, 'message' => 'Route non trouvée'], 404);
});
