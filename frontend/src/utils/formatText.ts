import type { TemplateVars } from '@/types/bill'

const PLACEHOLDER_RE = /\{(\w+)\}/g

export function formatText(
  template: string | undefined | null,
  vars: TemplateVars
): string {
  if (!template) return ''
  return template.replace(PLACEHOLDER_RE, (_, key: string) => {
    const v = vars[key]
    if (v === undefined || v === null || v === '') return '--'
    return String(v)
  })
}

export function buildBillTemplateVars(data: {
  user?: { name?: string; company?: string; days?: number; department?: string }
  summary_data?: Record<string, string | number | undefined>
}): TemplateVars {
  const u = data.user ?? {}
  const s = data.summary_data ?? {}
  return {
    name: u.name,
    company: u.company,
    days: u.days,
    department: u.department,
    ...s,
  }
}
