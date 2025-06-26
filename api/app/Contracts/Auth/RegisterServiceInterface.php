<?php

namespace App\Contracts\Auth;

interface RegisterServiceInterface
{
    public function register(array $userData): array;
}
