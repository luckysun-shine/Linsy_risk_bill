import type { BillData } from '@/types/bill'
import { apiGet } from './client'

export async function fetchBillData(token: string, year?: number): Promise<BillData> {
  if (year) {
    return apiGet<BillData>(`/bill/${year}/${encodeURIComponent(token)}/data`)
  }
  return apiGet<BillData>('/bill/data', { token })
}
