<?php

namespace App\Interfaces\Auth;

use App\Models\User;

interface PasswordServiceInterface
{
    public function changePassword(User $user, string $currentPassword, string $newPassword): void;
    public function resetPassword(string $email): string;
    public function confirmPasswordReset(string $token, string $newPassword): void;
}
