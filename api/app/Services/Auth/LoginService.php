<?php

namespace App\Services\Auth;

use App\Interfaces\Auth\LoginServiceInterface;
use App\Models\User;
use App\Exceptions\Auth\InvalidCredentialsException;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginService implements LoginServiceInterface
{
    public function authenticate(string $email, string $password): array
    {
        $user = $this->findUserByEmail($email);

        if (!$user || !$this->verifyPassword($password, $user->password)) {
            throw new InvalidCredentialsException('Identifiants incorrects');
        }

        $token = $this->generateToken($user);

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ];
    }

    public function logout(): void
    {
        $token = JWTAuth::getToken();

        if ($token) {
            JWTAuth::invalidate($token);
        }
    }

    public function refreshToken(): array
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        $user = JWTAuth::setToken($token)->toUser();

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ];
    }

    private function findUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    private function verifyPassword(string $password, string $hashedPassword): bool
    {
        return Hash::check($password, $hashedPassword);
    }

    private function generateToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }
}
