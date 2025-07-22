<?php

namespace App\Interfaces\Auth;

interface RegisterServiceInterface
{
    public function register(array $userData): array;
}
