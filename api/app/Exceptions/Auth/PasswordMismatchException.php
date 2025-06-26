<?php

namespace App\Exceptions\Auth;

use Exception;

class PasswordMismatchException extends Exception
{
    public function __construct(string $message = 'Les mots de passe ne correspondent pas')
    {
        parent::__construct($message);
    }
}
