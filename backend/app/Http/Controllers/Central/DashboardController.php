<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Models\Central\Admin;
use App\Models\Central\Congregation;
use App\Models\Central\Organization;
use App\Models\Central\Plan;
use App\Models\Central\Subscription;
use App\Models\Tenant\User as TenantUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /**
     * Estatísticas agregadas do dashboard do admin central.
     */
    public function stats(Request $request): JsonResponse
    {
        [$from, $to] = $this->resolvePeriod($request);

        $commonUsersCount = 0;
        $recentUsers = [];

        tenancy()->runForMultiple(
            Organization::active()->get(),
            function ($tenant) use (&$commonUsersCount, &$recentUsers) {
                $commonUsersCount += TenantUser::count();

                foreach (TenantUser::latest()->take(5)->get() as $user) {
                    $recentUsers[] = [
                        'name' => $user->name,
                        'created_at' => $user->created_at?->toIso8601String(),
                        'organization' => $tenant->name,
                    ];
                }
            }
        );

        usort($recentUsers, fn ($a, $b) => strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''));
        $recentUsers = array_slice($recentUsers, 0, 5);

        $revenueMonth = (float) Subscription::active()
            ->whereBetween('current_period_start', [$from, $to])
            ->sum('amount');

        $churnAmount = (float) Subscription::canceled()
            ->whereBetween('canceled_at', [$from, $to])
            ->sum('amount');

        $pastDueAmount = (float) Subscription::pastDue()->sum('amount');

        $growth = $this->buildOrganizationGrowth();

        return response()->json([
            'admins_count' => Admin::count(),
            'common_users_count' => $commonUsersCount,
            'organizations_count' => Organization::count(),
            'active_organizations_count' => Organization::active()->count(),
            'active_congregations_count' => Congregation::active()->count(),
            'plans_count' => Plan::count(),
            'revenue_month' => $revenueMonth,
            'churn_amount' => $churnAmount,
            'past_due_amount' => $pastDueAmount,
            'balance_month' => $revenueMonth - $churnAmount,
            'growth' => $growth,
            'revenue_expense_trend' => $this->buildRevenueExpenseTrend(),
            'recent_activities' => $this->buildRecentActivities(),
            'recent_users' => $recentUsers,
            'period' => ['from' => $from->toIso8601String(), 'to' => $to->toIso8601String()],
        ]);
    }

    /**
     * Série mensal (últimos 6 meses) de receita (assinaturas ativas cujo
     * período começou no mês) vs despesas (assinaturas canceladas no mês).
     */
    private function buildRevenueExpenseTrend(): array
    {
        $revenueByMonth = Subscription::active()
            ->selectRaw("to_char(current_period_start, 'YYYY-MM') as month, sum(amount) as total")
            ->where('current_period_start', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('total', 'month');

        $churnByMonth = Subscription::canceled()
            ->selectRaw("to_char(canceled_at, 'YYYY-MM') as month, sum(amount) as total")
            ->where('canceled_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('total', 'month');

        $trend = [];

        foreach ($this->lastSixMonths() as $month) {
            $trend[] = [
                'month' => $month,
                'revenue' => (float) ($revenueByMonth[$month] ?? 0),
                'expense' => (float) ($churnByMonth[$month] ?? 0),
            ];
        }

        return $trend;
    }

    /**
     * Série mensal (últimos 6 meses) de organizações cadastradas, com
     * zero-fill nos meses sem cadastro para manter o mesmo eixo temporal
     * do gráfico de Receita x Churn.
     */
    private function buildOrganizationGrowth(): array
    {
        $countByMonth = Organization::query()
            ->selectRaw("to_char(created_at, 'YYYY-MM') as month, count(*) as total")
            ->where('created_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('total', 'month');

        $growth = [];

        foreach ($this->lastSixMonths() as $month) {
            $growth[] = [
                'month' => $month,
                'total' => (int) ($countByMonth[$month] ?? 0),
            ];
        }

        return $growth;
    }

    /**
     * Os últimos 6 meses (incluindo o atual), no formato 'Y-m', em ordem
     * cronológica.
     */
    private function lastSixMonths(): array
    {
        return collect(range(5, 0))
            ->map(fn (int $i) => Carbon::now()->subMonths($i)->format('Y-m'))
            ->all();
    }

    /**
     * Resolve o range [from, to] a partir do query param `period`
     * (week|month|quarter|year|custom, default month).
     */
    private function resolvePeriod(Request $request): array
    {
        $period = $request->query('period', 'month');

        if ($period === 'custom' && $request->query('from') && $request->query('to')) {
            return [
                Carbon::parse($request->query('from'))->startOfDay(),
                Carbon::parse($request->query('to'))->endOfDay(),
            ];
        }

        return match ($period) {
            'week' => [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()],
            'quarter' => [Carbon::now()->subMonths(3)->startOfDay(), Carbon::now()->endOfDay()],
            'year' => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            default => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
        };
    }

    /**
     * Sem tabela de activity log dedicada: sintetiza um feed unindo os
     * registros mais recentes de organizations/admins/subscriptions.
     */
    private function buildRecentActivities(): array
    {
        $activities = [];

        foreach (Organization::latest()->take(5)->get() as $organization) {
            $activities[] = [
                'id' => "organization-{$organization->id}",
                'type' => 'organization',
                'text' => "Organização \"{$organization->name}\" cadastrada",
                'created_at' => $organization->created_at?->toIso8601String(),
            ];
        }

        foreach (Admin::latest()->take(5)->get() as $admin) {
            $activities[] = [
                'id' => "admin-{$admin->id}",
                'type' => 'admin',
                'text' => "Administrador \"{$admin->name}\" cadastrado",
                'created_at' => $admin->created_at?->toIso8601String(),
            ];
        }

        foreach (Subscription::with('organization')->latest()->take(5)->get() as $subscription) {
            $label = $subscription->status->value === 'canceled' ? 'cancelada' : 'ativada';
            $activities[] = [
                'id' => "subscription-{$subscription->id}",
                'type' => 'subscription',
                'text' => "Assinatura {$label} para \"{$subscription->organization?->name}\"",
                'created_at' => $subscription->created_at?->toIso8601String(),
            ];
        }

        usort($activities, fn ($a, $b) => strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''));

        return array_slice($activities, 0, 5);
    }
}
