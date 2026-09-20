import api from './client'

export interface LinkAccessStat {
  link_id: string
  year: number
  employee_id: string
  employee_name: string | null
  department: string | null
  role_key: string
  is_revoked: boolean
  dept_code: string | null
  campaign_id: string | null
  campaign_title: string | null
  view_count: number
  unique_ips: number
  first_accessed_at: string | null
  last_accessed_at: string | null
  link_created_at: string
}

export interface DayAccessStat {
  date: string
  count: number
}

export interface RecentAccessItem {
  id: string
  link_id: string | null
  department: string | null
  employee_name: string | null
  employee_id: string | null
  year: number | null
  ip_address: string | null
  user_agent: string | null
  accessed_at: string
}

export interface AccessStatsData {
  totalViews: number
  uniqueLinks: number
  openedLinks: number
  totalLinks: number
  uniqueIps: number
  byDay: DayAccessStat[]
  byLink: LinkAccessStat[]
  recent: RecentAccessItem[]
}

export async function fetchAccessStats(params?: {
  year?: number
  from?: string
  to?: string
  campaign_id?: string
}) {
  const { data } = await api.get('/admin/stats', { params })
  return data.data as AccessStatsData
}
