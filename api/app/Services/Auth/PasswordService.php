<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Interfaces\Auth\PasswordServiceInterface;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Exceptions\Auth\PasswordMismatchException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;

class PasswordService implements PasswordServiceInterface
{
    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw new InvalidCredentialsException('Mot de passe actuel incorrect');
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);
    }

    public function resetPassword(string $email): string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new InvalidCredentialsException('Aucun utilisateur trouvé avec cet email');
        }

        $resetToken = Str::random(60);

        // Stocker le token de reset (vous pourriez créer une table password_resets)
        $user->update([
            'reset_token' => Hash::make($resetToken),
            'reset_token_expires_at' => now()->addHours(2)
        ]);

        // Envoyer l'email (optionnel pour les tests)
        if (config('mail.send_reset_emails', true)) {
            Mail::to($user)->send(new PasswordResetMail($resetToken));
        }

        return $resetToken;
    }

    public function confirmPasswordReset(string $token, string $newPassword): void
    {
        $user = User::whereNotNull('reset_token')
            ->where('reset_token_expires_at', '>', now())
            ->get()
            ->first(function ($user) use ($token) {
                return Hash::check($token, $user->reset_token);
            });

        if (!$user) {
            throw new InvalidCredentialsException('Token de reset invalide ou expiré');
        }

        $user->update([
            'password' => Hash::make($newPassword),
            'reset_token' => null,
            'reset_token_expires_at' => null
        ]);
    }
}
