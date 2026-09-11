export type UserRole = 'admin' | 'api_client';

export interface User {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithSecrets extends User {
  password_hash: string | null;
  api_key_hash: string | null;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  type: 'access';
}

export interface BillLink {
  id: string;
  token: string;
  year: number;
  employee_id: string;
  employee_name: string | null;
  department: string | null;
  role_key: string;
  expires_at: Date | null;
  is_revoked: boolean;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BillDataRecord {
  id: string;
  link_id: string;
  year: number;
  employee_id: string;
  payload: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  user_id: string | null;
  is_active: boolean;
  last_used_at: Date | null;
  created_at: Date;
  expires_at: Date | null;
}

export interface AccessLog {
  id: string;
  link_id: string | null;
  token_prefix: string | null;
  ip_address: string | null;
  user_agent: string | null;
  accessed_at: Date;
}

export interface BillDataPayload {
  user: {
    name: string;
    emp_id: string;
    department: string;
    role_key: string;
    company: string;
    days: number;
  };
  summary_data: Record<string, unknown>;
  details_data: Record<string, unknown>;
  page_config: unknown[];
  assets?: Record<string, unknown>;
}
