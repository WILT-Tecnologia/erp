export interface Domain {
  id: string;
  organization_id: string;
  domain: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_token?: string | null;
  verified_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DomainFormValue {
  domain: string;
  is_primary?: boolean;
}
