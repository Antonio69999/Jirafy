<?php

namespace App\Services\Auth;

use App\Models\Auth\User;
use App\Interfaces\Auth\RegisterServiceInterface;
use App\Exceptions\Auth\EmailAlreadyExistsException;
use App\Exceptions\Auth\PasswordMismatchException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class RegisterService implements RegisterServiceInterface
{
    public function register(array $userData): array
    {
        $this->validateRegistrationData($userData);

        $user = DB::transaction(function () use ($userData) {
            return $this->createUser($userData);
        });

        $token = $this->generateToken($user);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ];
    }

    private function validateRegistrationData(array $userData): void
    {
        $this->checkEmailExists($userData['email']);
        $this->checkPasswordConfirmation($userData);
    }

    private function checkEmailExists(string $email): void
    {
        if (User::where('email', $email)->exists()) {
            throw new EmailAlreadyExistsException('L\'email est déjà utilisé');
        }
    }

    private function checkPasswordConfirmation(array $userData): void
    {
        if ($userData['password'] !== $userData['password_confirmation']) {
            throw new PasswordMismatchException('Les mots de passe ne correspondent pas');
        }
    }

    private function createUser(array $userData): User
    {
        return User::create([
            'name' => $userData['name'] ?? $userData['email'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
            'email_verified_at' => now(),
        ]);
    }

    private function generateToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }
}
