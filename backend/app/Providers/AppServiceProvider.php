<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Spec da API tenant (default)
        Scramble::configure()
            ->routes(fn ($route) => str_starts_with($route->uri, 'api/tenant'))
            ->withDocumentTransformers(function (OpenApi $openApi) {
                $openApi->secure(SecurityScheme::http('bearer'));
            });

        // Spec da API admin (segundo endpoint)
        Scramble::registerApi('admin', [
            'info' => ['title' => 'API Admin (Central)', 'version' => '1.0.0'],
        ])->routes(fn ($route) => str_starts_with($route->uri, 'api/admin') || str_starts_with($route->uri, 'api/plans'));

        // Proteger /docs em produção
        Gate::define('viewApiDocs', fn ($user = null) => app()->environment('local'));
        }
}
