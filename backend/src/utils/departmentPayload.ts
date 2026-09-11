import { departmentEmployeeId } from './deepMerge'

type PageConfigItem = { type?: string; focusId?: string; [key: string]: unknown }

/** 部门 overrides 约定结构 */
export interface DepartmentPublishOverrides {
  /** 是否包含部门聚焦三页；CEO 等组织视角应为 false */
  include_dept_focus?: boolean
  details_data?: {
    dept_focus_reports?: Array<Record<string, unknown>>
  }
}

export function stripDeptFocusFromPayload(
  base: Record<string, unknown>
): Record<string, unknown> {
  const details = {
    ...((base.details_data as Record<string, unknown>) ?? {}),
  }
  delete details.dept_focus_reports

  const pageConfig = Array.isArray(base.page_config)
    ? (base.page_config as PageConfigItem[]).filter(
        (p) => p?.type !== 'dept_focus' && p?.type !== 'manager'
      )
    : []

  return {
    ...base,
    details_data: details,
    page_config: pageConfig,
  }
}

export function insertDeptFocusPages(
  pageConfig: PageConfigItem[],
  focusIds: string[]
): PageConfigItem[] {
  const pages = pageConfig.filter((p) => p?.type !== 'dept_focus')
  const focusPages = focusIds.map((focusId) => ({ type: 'dept_focus', focusId }))

  const milestoneIdx = pages.findIndex((p) => p?.type === 'milestone')
  if (milestoneIdx >= 0) {
    pages.splice(milestoneIdx + 1, 0, ...focusPages)
    return pages
  }

  const clusterIdx = pages.findIndex((p) => p?.type === 'cluster')
  if (clusterIdx >= 0) {
    pages.splice(clusterIdx, 0, ...focusPages)
    return pages
  }

  return [...pages, ...focusPages]
}

export function buildDepartmentPayload(params: {
  base: Record<string, unknown>
  deptName: string
  recipientName?: string | null
  roleKey?: string
  overrides?: Record<string, unknown>
  employeeId: string
}): Record<string, unknown> {
  const overrides = (params.overrides ?? {}) as DepartmentPublishOverrides
  const shared = stripDeptFocusFromPayload(params.base)

  const includeFocus =
    overrides.include_dept_focus === true ||
    (Array.isArray(overrides.details_data?.dept_focus_reports) &&
      (overrides.details_data?.dept_focus_reports?.length ?? 0) > 0)

  const user = {
    ...((shared.user as Record<string, unknown>) ?? {}),
    name: params.recipientName || params.deptName,
    emp_id: params.employeeId,
    department: params.deptName,
    role_key: params.roleKey || 'manager',
  }

  const details = {
    ...((shared.details_data as Record<string, unknown>) ?? {}),
  }

  let pageConfig = Array.isArray(shared.page_config)
    ? ([...(shared.page_config as PageConfigItem[])] as PageConfigItem[])
    : []

  if (includeFocus) {
    const reports = (overrides.details_data?.dept_focus_reports ?? []).map((item) => ({
      ...item,
      department: params.deptName,
    }))
    details.dept_focus_reports = reports
    const focusIds = reports
      .map((r) => String((r as { id?: string }).id || ''))
      .filter(Boolean)
    pageConfig = insertDeptFocusPages(pageConfig, focusIds)
  } else {
    delete details.dept_focus_reports
  }

  return {
    ...shared,
    user,
    details_data: details,
    page_config: pageConfig,
  }
}

export { departmentEmployeeId }
