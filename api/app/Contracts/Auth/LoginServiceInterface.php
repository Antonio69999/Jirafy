<?php

namespace App\Contracts\Auth;

interface LoginServiceInterface
{
    public function authenticate(string $email, string $password): array;
    public function logout(): void;
    public function refreshToken(): array;
}
