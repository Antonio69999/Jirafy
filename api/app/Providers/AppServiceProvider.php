<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\Auth\LoginServiceInterface;
use App\Interfaces\Auth\RegisterServiceInterface;
use App\Interfaces\Auth\PasswordServiceInterface;
use App\Services\Auth\LoginService;
use App\Services\Auth\RegisterService;
use App\Services\Auth\PasswordService;
use App\Interfaces\Ticketing\ProjectServiceInterface;
use App\Services\Ticketing\ProjectService;
use App\Interfaces\Ticketing\IssueServiceInterface;
use App\Services\Ticketing\IssueService;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
