<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),

    // Permite qualquer subdomínio de organização (ex.: igreja-central.localhost:4200)
    // sob o domínio base configurado em TENANT_BASE_DOMAIN, usado para identificar
    // o tenant automaticamente via InitializeTenancyByDomain.
    'allowed_origins_patterns' => [
        '#^https?://[a-z0-9-]+\.' . preg_quote(env('TENANT_BASE_DOMAIN', 'localhost'), '#') . '(:\d+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
