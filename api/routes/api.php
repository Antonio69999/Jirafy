<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Ticketing\{ProjectController, IssueController, ProjectMemberController, StatusController};
use App\Http\Controllers\Ticketing\Metadata\{IssueMetadataController, LabelController};
use App\Http\Controllers\Teams\TeamController;
use App\Http\Controllers\Workflow\WorkflowController;

// Routes publiques
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:api')->group(function () {
  // Auth
  Route::post('auth/logout', [AuthController::class, 'logout']);
  Route::get('auth/me', [AuthController::class, 'me']);
  Route::put('auth/update-profile', [AuthController::class, 'updateProfile']);

  // Users
  Route::get('users', [UserController::class, 'index']);

  // Issue metadata
  Route::get('issue-types', [IssueMetadataController::class, 'types']);
  Route::get('statuses', [IssueMetadataController::class, 'statuses']);
  Route::get('priorities', [IssueMetadataController::class, 'priorities']);

  //  ROUTES STATUSES : /available AVANT /{status}
  Route::prefix('statuses')->group(function () {
    Route::get('/', [StatusController::class, 'index']);

    //  Routes spécifiques AVANT les routes génériques
    Route::get('/available', [StatusController::class, 'available']);
    Route::get('/key/{key}', [StatusController::class, 'showByKey']);

    //  Route générique APRÈS
    Route::get('/{status}', [StatusController::class, 'show']);

    Route::middleware('check.role:admin')->group(function () {
      Route::post('/', [StatusController::class, 'store']);
      Route::put('/{status}', [StatusController::class, 'update']);
      Route::delete('/{status}', [StatusController::class, 'destroy']);
    });
  });

  Route::prefix('projects/{project}/workflow')->group(function () {
    Route::get('/transitions', [WorkflowController::class, 'getProjectTransitions']);
    Route::get('/validate', [WorkflowController::class, 'validateWorkflow']);
  });

  Route::prefix('workflow')->group(function () {
    Route::post('/transitions', [WorkflowController::class, 'createTransition']);
    Route::delete('/transitions/{transition}', [WorkflowController::class, 'deleteTransition']);
  });

  Route::prefix('issues/{issue}')->group(function () {
    Route::get('/transitions', [WorkflowController::class, 'getAvailableTransitions']);
    Route::post('/transition', [WorkflowController::class, 'performTransition']);
  });

  // Labels d'un projet
  Route::prefix('projects/{project}/labels')->group(function () {
    Route::get('/', [LabelController::class, 'projectLabels']);
    Route::get('/available', [LabelController::class, 'availableForProject']);
  });

  // Labels globaux
  Route::get('labels', [LabelController::class, 'index']);

  // Routes AUTORISÉES aux clients (lecture + création de tickets)
  Route::get('projects', [ProjectController::class, 'index']);
  Route::get('projects/{project}', [ProjectController::class, 'show']);
  Route::get('projects/{project}/members', [ProjectMemberController::class, 'index']);

  // Tickets (issues)
  Route::apiResource('projects.issues', IssueController::class);
  Route::get('issues/my-tickets', [IssueController::class, 'myTickets']);

  // Routes INTERDITES aux clients (uniquement utilisateurs internes)
  Route::middleware('check.customer')->group(function () {
    // Teams
    Route::apiResource('teams', TeamController::class);

    // Gestion des projets (seuls les admins peuvent créer/modifier/supprimer)
    Route::post('projects', [ProjectController::class, 'store']);
    Route::put('projects/{project}', [ProjectController::class, 'update']);
    Route::delete('projects/{project}', [ProjectController::class, 'destroy']);

    // Gestion des membres de projet
    Route::apiResource('projects.members', ProjectMemberController::class)->only(['store', 'update', 'destroy']);
  });

  // Routes des projets
  Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{project}', [ProjectController::class, 'show']);

    Route::middleware('check.role:project_create')->group(function () {
      Route::post('/', [ProjectController::class, 'store']);
    });

    Route::middleware('check.project:edit')->group(function () {
      Route::put('/{project}', [ProjectController::class, 'update']);
    });

    Route::middleware('check.role:admin')->group(function () {
      Route::delete('/{project}', [ProjectController::class, 'destroy']);
    });

    // Issues d'un projet spécifique
    Route::get('/{project}/issues', [IssueController::class, 'projectIssues']);

    // Labels spécifiques à un projet
    Route::get('/{project}/labels', [LabelController::class, 'projectLabels']);

    // Gestion des membres de projet
    Route::prefix('/{project}/members')->middleware('check.project:view')->group(function () {
      Route::get('/', [ProjectMemberController::class, 'index']);

      Route::middleware('check.project:manage_members')->group(function () {
        Route::post('/', [ProjectMemberController::class, 'store']);
        Route::put('/{userId}', [ProjectMemberController::class, 'update']);
        Route::delete('/{userId}', [ProjectMemberController::class, 'destroy']);
      });
    });
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
