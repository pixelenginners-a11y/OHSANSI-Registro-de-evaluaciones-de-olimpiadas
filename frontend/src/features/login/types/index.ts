export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type User = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role_id: number;
  active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
