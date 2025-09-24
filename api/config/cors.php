<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'jirafyapi.garage404.com',
        'https://jirafy.garage404.com', // Votre domaine client
        'http://localhost:5173', // Pour le dev local
        'http://localhost:5175', // Votre port Vite
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
