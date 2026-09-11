export interface CampaignRecord {
  id: string;
  year: number;
  title: string;
  status: 'draft' | 'published';
  base_payload: Record<string, unknown>;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CampaignDepartmentRecord {
  id: string;
  campaign_id: string;
  dept_code: string;
  dept_name: string;
  recipient_name: string | null;
  role_key: string;
  sort_order: number;
  overrides: Record<string, unknown>;
  link_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CampaignDepartmentInput {
  dept_code: string;
  dept_name: string;
  recipient_name?: string | null;
  role_key?: string;
  sort_order?: number;
  overrides?: Record<string, unknown>;
}
