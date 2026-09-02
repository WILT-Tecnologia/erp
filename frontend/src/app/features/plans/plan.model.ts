export type PlanStatus = 'active' | 'inactive';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  trial_days: number;
  max_users: number;
  max_members: number;
  max_storage_gb: number;
  features: string[];
  is_public: boolean;
  sort_order: number;
  status: PlanStatus;
  created_at?: string;
  updated_at?: string;
}

export type PlanFormValue = {
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  trial_days: number;
  max_users: number;
  max_members: number;
  max_storage_gb: number;
  features: string[];
  is_public: boolean;
  sort_order: number;
  status: PlanStatus;
};
