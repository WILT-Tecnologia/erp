export interface Admin {
  id: string;
  name: string;
  email: string;
  is_super_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}
