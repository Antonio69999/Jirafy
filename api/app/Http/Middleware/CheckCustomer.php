<?php
// filepath: api/app/Http/Middleware/CheckCustomer.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomer
{
    /**
     * Bloquer l'accès aux clients pour certaines routes
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = auth()->user();

        if ($user->isCustomer()) {
            return response()->json([
                'message' => 'Accès refusé. Cette fonctionnalité est réservée aux utilisateurs internes.'
            ], 403);
        }

        return $next($request);
    }
}