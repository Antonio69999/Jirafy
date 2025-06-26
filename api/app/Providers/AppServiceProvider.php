<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\Auth\LoginServiceInterface;
use App\Contracts\Auth\RegisterServiceInterface;
use App\Contracts\Auth\PasswordServiceInterface;
use App\Services\Auth\LoginService;
use App\Services\Auth\RegisterService;
use App\Services\Auth\PasswordService;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
