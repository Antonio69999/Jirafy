<?php

namespace App\Exceptions\Auth;

use Exception;

class InvalidCredentialsException extends Exception
{
    public function __construct(string $message = 'Identifiants incorrects')
    {
        parent::__construct($message);
    }
}
