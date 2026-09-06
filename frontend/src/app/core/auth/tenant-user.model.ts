export interface TenantUser {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
  permissions: string[];
}

export interface TenantOrganizationSummary {
  id: string;
  name: string;
  slug: string;
}

export interface TenantLoginPayload {
  email: string;
  password: string;
  device_name?: string;
}

export interface TenantLoginResponse {
  token: string;
  user: TenantUser;
  organization: TenantOrganizationSummary | null;
}
