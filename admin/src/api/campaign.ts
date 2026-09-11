import api from './client'
import type { BillData, CampaignDepartment, CampaignSummary } from '@/types/bill'

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth/login', { username, password })
  return data.data as { token: string; user: { id: string; username: string } }
}

export async function fetchCampaigns() {
  const { data } = await api.get('/admin/campaigns')
  return data.data as CampaignSummary[]
}

export async function createCampaign(payload: {
  year: number
  title: string
  seed_departments?: boolean
}) {
  const { data } = await api.post('/admin/campaigns', payload)
  return data.data as {
    campaign: CampaignSummary & { base_payload: BillData }
    departments: CampaignDepartment[]
  }
}

export async function fetchCampaign(id: string) {
  const { data } = await api.get(`/admin/campaigns/${id}`)
  return data.data as {
    campaign: CampaignSummary & { base_payload: BillData; status: 'draft' | 'published' }
    departments: CampaignDepartment[]
  }
}

export async function saveCampaign(
  id: string,
  payload: {
    title?: string
    base_payload?: BillData
    departments?: Array<{
      dept_code: string
      dept_name: string
      recipient_name?: string | null
      role_key?: string
      sort_order?: number
      overrides?: Record<string, unknown>
    }>
  }
) {
  const { data } = await api.put(`/admin/campaigns/${id}`, payload)
  return data.data
}

export async function publishCampaign(id: string) {
  const { data } = await api.post(`/admin/campaigns/${id}/publish`)
  return data.data as {
    campaign: CampaignSummary
    results: Array<{
      dept_code: string
      dept_name: string
      url: string
      token: string
      created: boolean
    }>
  }
}

export async function deleteCampaign(id: string) {
  await api.delete(`/admin/campaigns/${id}`)
}

export async function fetchDefaultPayload() {
  const { data } = await api.get('/admin/campaigns/templates/default')
  return data.data as BillData
}
