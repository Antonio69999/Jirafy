<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\Auth\LoginServiceInterface;
use App\Interfaces\Auth\RegisterServiceInterface;
use App\Interfaces\Auth\PasswordServiceInterface;
use App\Interfaces\Permission\PermissionServiceInterface;
use App\Services\Auth\LoginService;
use App\Services\Auth\RegisterService;
use App\Services\Auth\PasswordService;
use App\Interfaces\Ticketing\ProjectServiceInterface;
use App\Services\Ticketing\ProjectService;
use App\Interfaces\Ticketing\IssueServiceInterface;
use App\Services\Ticketing\IssueService;
use App\Interfaces\Ticketing\StatusServiceInterface;
use App\Services\Ticketing\StatusService;
use App\Interfaces\Teams\TeamServiceInterface;
use App\Interfaces\Ticketing\LabelServiceInterface;
use App\Services\Permission\PermissionService;
use App\Services\Teams\TeamService;
use App\Services\Ticketing\LabelService;
use App\Interfaces\Workflow\WorkflowServiceInterface;
use App\Services\Workflow\WorkflowService;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(LoginServiceInterface::class, LoginService::class);
        $this->app->bind(RegisterServiceInterface::class, RegisterService::class);
        $this->app->bind(PasswordServiceInterface::class, PasswordService::class);
        $this->app->bind(ProjectServiceInterface::class, ProjectService::class);
        $this->app->bind(IssueServiceInterface::class, IssueService::class);
        $this->app->bind(StatusServiceInterface::class, StatusService::class);
        $this->app->bind(TeamServiceInterface::class, TeamService::class);
        $this->app->bind(PermissionServiceInterface::class, PermissionService::class);
        $this->app->bind(LabelServiceInterface::class, LabelService::class);
        $this->app->bind(WorkflowServiceInterface::class, WorkflowService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
