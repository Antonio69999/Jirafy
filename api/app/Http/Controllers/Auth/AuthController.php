<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Contracts\Auth\LoginServiceInterface;
use App\Contracts\Auth\RegisterServiceInterface;
use App\Contracts\Auth\PasswordServiceInterface;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Exceptions\Auth\EmailAlreadyExistsException;
use App\Exceptions\Auth\PasswordMismatchException;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private LoginServiceInterface $loginService,
        private RegisterServiceInterface $registerService,
        private PasswordServiceInterface $passwordService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginService->authenticate(
                $request->email,
                $request->password
            );

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => $result
            ]);
        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->registerService->register($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'data' => $result
            ], 201);
        } catch (EmailAlreadyExistsException | PasswordMismatchException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function logout(): JsonResponse
    {
        $this->loginService->logout();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function refresh(): JsonResponse
    {
        try {
            $result = $this->loginService->refreshToken();

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide'
            ], 401);
        }
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => auth()->user()
        ]);
    }
}
