<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Pest\Support\Str;
use Tests\TestCase;
uses(Tests\TestCase::class, RefreshDatabase::class)->in('Feature/Central');
uses(Tests\TestCase::class)->in('Feature/Tenant');

function createTenant(array $attrs = []): \App\Models\Central\Tenant
{
    $tenant = \App\Models\Central\Tenant::create(array_merge([
        'id' => 'test-' . \Illuminate\Support\Str::random(8),
        'name' => 'Test Org',
        'slug' => 'test-org-' . \Illuminate\Support\Str::random(4),
        'status' => 'active',
        'timezone' => 'America/Cuiaba',
        'language' => 'pt-BR',
    ], $attrs));

    tenancy()->initialize($tenant);

    return $tenant;
}

function endTenancy(): void
{
    tenancy()->end();
}
/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

// pest()->extend(TestCase::class)
//  // ->use(RefreshDatabase::class)
//     ->in('Feature');

// /*
// |--------------------------------------------------------------------------
// | Expectations
// |--------------------------------------------------------------------------
// |
// | When you're writing tests, you often need to check that values meet certain conditions. The
// | "expect()" function gives you access to a set of "expectations" methods that you can use
// | to assert different things. Of course, you may extend the Expectation API at any time.
// |
// */

// expect()->extend('toBeOne', function () {
//     return $this->toBe(1);
// });

// /*
// |--------------------------------------------------------------------------
// | Functions
// |--------------------------------------------------------------------------
// |
// | While Pest is very powerful out-of-the-box, you may have some testing code specific to your
// | project that you don't want to repeat in every file. Here you can also expose helpers as
// | global functions to help you to reduce the number of lines of code in your test files.
// |
// */

// function something()
// {
//     // ..
// }
