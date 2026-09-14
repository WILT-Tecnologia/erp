import { type Plan } from '../plans/plan.model';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  amount: number;
  started_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  plan: Plan | null;
  created_at?: string;
  updated_at?: string;
}
