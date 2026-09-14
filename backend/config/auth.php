<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option defines the default authentication "guard" and password
    | reset "broker" for your application. You may change these values
    | as required, but they're a perfect start for most applications.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'api-admin'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Next, you may define every authentication guard for your application.
    | Of course, a great default configuration has been defined for you
    | which utilizes session storage plus the Eloquent user provider.
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | Supported: "session"
    |
    */

    'guards' => [
        // Laravel merges its own framework-default auth.php on top of this
        // file for the 'guards'/'providers'/'passwords' keys specifically
        // (Illuminate\Foundation\Bootstrap\LoadConfiguration), so a 'web'
        // guard pointing at a 'users' provider always resolves even if not
        // declared here. It's shadowed below instead of left dangling, so
        // it can never fatal-error by resolving the (nonexistent)
        // App\Models\User the framework default points at.
        'web' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],

        'api-admin' => [
            'driver' => 'sanctum', // se estiver usando Sanctum
            'provider' => 'admins',
        ],

        'api-tenant' => [
            'driver' => 'sanctum',
            'provider' => 'tenant_users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | If you have multiple user tables or models you may configure multiple
    | providers to represent the model / table. These providers may then
    | be assigned to any extra authentication guards you have defined.
    |
    | Supported: "database", "eloquent"
    |
    */

    'providers' => [
        // Shadows the framework default 'users' provider (see comment on
        // the 'web' guard above) so it can never resolve the nonexistent
        // App\Models\User.
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\Central\Admin::class,
        ],

        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Central\Admin::class,
        ],

        'tenant_users' => [
            'driver' => 'eloquent',
            'model' => App\Models\Tenant\User::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | These configuration options specify the behavior of Laravel's password
    | reset functionality, including the table utilized for token storage
    | and the user provider that is invoked to actually retrieve users.
    |
    | The expiry time is the number of minutes that each reset token will be
    | considered valid. This security feature keeps tokens short-lived so
    | they have less time to be guessed. You may change this as needed.
    |
    | The throttle setting is the number of seconds a user must wait before
    | generating more password reset tokens. This prevents the user from
    | quickly generating a very large amount of password reset tokens.
    |
    */

    // Not used anywhere (no password-reset routes exist). Left empty here;
    // the framework's default 'passwords.users' entry still gets merged
    // back in regardless (see comment above), but it's harmless since it
    // resolves through the now-safely-shadowed 'users' provider.
    'passwords' => [],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Here you may define the number of seconds before a password confirmation
    | window expires and users are asked to re-enter their password via the
    | confirmation screen. By default, the timeout lasts for three hours.
    |
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
