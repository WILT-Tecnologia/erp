import { type Admin } from '../../core/auth/admin.model';
import { type Plan } from '../plans/plan.model';

export type OrganizationStatus = 'active' | 'suspended' | 'inactive';

export interface Organization {
  id: string;
  name: string;
  legal_name: string | null;
  slug: string;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  logo: string | null;
  cover_image: string | null;
  description: string | null;
  founded_at: string | null;
  status: OrganizationStatus;
  timezone: string;
  language: string;
  settings: Record<string, unknown> | null;
  plan: Plan | null;
  owner_admin: Admin | null;
  domains: string[];
  schema_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationFormValue {
  name: string;
  legal_name?: string;
  slug: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  description?: string;
  founded_at?: string;
  status: OrganizationStatus;
  timezone: string;
  language: string;
  plan_id?: string;
  owner_admin_id?: string;
  first_user?: { name: string; email: string; password: string; password_confirmation: string };
}
