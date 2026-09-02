export interface DashboardGrowthPoint {
  month: string;
  total: number;
}

export interface DashboardRevenueExpensePoint {
  month: string;
  revenue: number;
  expense: number;
}

export interface DashboardActivity {
  id: string;
  type: 'organization' | 'admin' | 'subscription';
  text: string;
  created_at: string | null;
}

export interface DashboardRecentUser {
  name: string;
  created_at: string | null;
  organization: string;
}

export interface DashboardStats {
  admins_count: number;
  common_users_count: number;
  organizations_count: number;
  active_organizations_count: number;
  active_congregations_count: number;
  plans_count: number;
  revenue_month: number;
  churn_amount: number;
  past_due_amount: number;
  balance_month: number;
  growth: DashboardGrowthPoint[];
  revenue_expense_trend: DashboardRevenueExpensePoint[];
  recent_activities: DashboardActivity[];
  recent_users: DashboardRecentUser[];
  period: { from: string; to: string };
}
