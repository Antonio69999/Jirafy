<?php

namespace App\Exceptions\Auth;

use Exception;

class EmailAlreadyExistsException extends Exception
{
    public function __construct(string $message = 'L\'email est déjà utilisé')
    {
        parent::__construct($message);
    }
}
