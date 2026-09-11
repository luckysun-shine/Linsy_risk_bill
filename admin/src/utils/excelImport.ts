import * as XLSX from 'xlsx'
import type { BillData, CampaignDepartment, DeptFocusReport, MetricPart } from '@/types/bill'

function cell(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim() !== '') return row[key]
  }
  return undefined
}

function asText(value: unknown) {
  return value == null ? '' : String(value).trim()
}

function asNumber(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function sheetToRows(wb: XLSX.WorkBook, name: string) {
  const sheet = wb.Sheets[name]
  if (!sheet) return [] as Record<string, unknown>[]
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
}

function parseMetricLine(text: string): MetricPart[] {
  // 支持用 [[数字]] 标记高亮，例如：参与完成审计项目 [[3]] 起
  const parts: MetricPart[] = []
  const regex = /\[\[(.+?)\]\]/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text))) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index) })
    }
    parts.push({ text: match[1], accent: true })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts.length ? parts : [{ text }]
}

/** 生成可下载的 Excel 模板 */
export function buildImportTemplateWorkbook() {
  const wb = XLSX.utils.book_new()

  const shared = [
    ['字段', '值', '说明'],
    ['company', '林氏家居', '公司名称'],
    ['keyword', '风险防控守护者', '关键词'],
    ['risk_level', '优', '风险等级'],
    ['risk_score', 92, '风险分'],
    ['rank_percent', 90, '超越百分比'],
    ['total_models', 1254, '模型数'],
    ['savings', 128500, '挽损金额'],
    ['cover_headline', '2025年风险账单来啦!', '封面 headline'],
    ['cover_title', '征途坎坷成画', '封面主标题'],
    ['cover_subtitle', '沿途波澜皆景', '封面副标题'],
    ['compliance_intro', '过去一年，我们通过多元化的宣教手段……', '合规数读引言'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(shared), '公司公共')

  const depts = [
    ['部门编码', '部门名称', '接收人', '是否部门聚焦', '角色'],
    ['ceo', 'CEO', 'CEO', '否', 'manager'],
    ['finance', '财经中心', '财经中心主管', '是', 'manager'],
    ['product', '产品中心', '产品中心主管', '是', 'manager'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(depts), '部门列表')

  const focus = [
    [
      '部门编码',
      '聚焦ID',
      '眉题',
      '提示标题',
      '提示正文',
      '指标行1',
      '指标行2',
      '指标行3',
      '指标行4',
      '指标行5',
      '指标行6',
    ],
    [
      'finance',
      'audit',
      '在过去一年中',
      '风控提示',
      '建议加强对财经相关的系统账号权限管控……',
      '参与完成审计项目 [[3]] 起',
      '我们一起参与整改项目 [[2]] 起',
      '触发整改任务 [[8]] 个',
      '关闭整改任务 [[8]] 个',
      '未关闭任务 [[0]] 个',
      '累计为公司避免损失 [[0]] 万元',
    ],
    [
      'finance',
      'supervision',
      '在过去一年中',
      '风控提示',
      '关键岗位多，各级管理者应时刻保持关注……',
      '涉及监察事项 [[1]] 起',
      '违规合作商数量 [[0]] 家',
      '员工积分扣减申请发起 [[0]] 人次',
      '共向违规员工发出红牌 [[0]] 张，黄牌 [[0]] 张，蓝牌 [[0]] 张',
      '',
      '',
    ],
    [
      'finance',
      'control',
      '在过去一年中',
      '风控提示',
      '建议加强对前端业务链路的下探……',
      '参与完成内控项目 [[4]] 起',
      '触发整改任务 [[18]] 个',
      '到期应关闭任务 [[18]] 个',
      '关闭整改任务 [[18]] 个',
      '未关闭任务 [[0]] 个',
      '累计为公司避免损失 [[44.5]] 万元',
    ],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(focus), '部门聚焦')

  return wb
}

export function downloadImportTemplate() {
  const wb = buildImportTemplateWorkbook()
  XLSX.writeFile(wb, '风险账单导入模板.xlsx')
}

export async function parseImportExcel(file: File): Promise<{
  sharedPatch: Partial<BillData>
  departments: CampaignDepartment[]
}> {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })

  const sharedRows = sheetToRows(wb, '公司公共')
  const sharedMap: Record<string, unknown> = {}
  for (const row of sharedRows) {
    const key = asText(cell(row, '字段', 'field', 'key'))
    if (!key) continue
    sharedMap[key] = cell(row, '值', 'value')
  }

  const sharedPatch: Partial<BillData> = {
    user: {
      name: '公司',
      emp_id: 'COMPANY',
      department: '公司',
      role_key: 'manager',
      company: asText(sharedMap.company) || '林氏家居',
      days: 0,
    },
    summary_data: {
      keyword: asText(sharedMap.keyword),
      risk_level: asText(sharedMap.risk_level),
      risk_score: asNumber(sharedMap.risk_score),
      rank_percent: asNumber(sharedMap.rank_percent),
      total_models: asNumber(sharedMap.total_models),
      savings: asNumber(sharedMap.savings),
    },
    page_config: [
      {
        type: 'cover',
        headline: asText(sharedMap.cover_headline),
        title: asText(sharedMap.cover_title),
        subtitle: asText(sharedMap.cover_subtitle),
      },
    ],
  }

  if (sharedMap.compliance_intro) {
    sharedPatch.details_data = {
      risk_categories: [],
      radar: { dimensions: [], values: [] },
      compliance_education: {
        intro: asText(sharedMap.compliance_intro),
        items: [],
      },
    }
  }

  const focusRows = sheetToRows(wb, '部门聚焦')
  const focusByDept = new Map<string, DeptFocusReport[]>()
  for (const row of focusRows) {
    const code = asText(cell(row, '部门编码', 'dept_code', '编码'))
    if (!code) continue
    const metrics: MetricPart[][] = []
    for (let i = 1; i <= 6; i++) {
      const line = asText(cell(row, `指标行${i}`, `metric${i}`))
      if (line) metrics.push(parseMetricLine(line))
    }
    const report: DeptFocusReport = {
      id: asText(cell(row, '聚焦ID', 'focus_id', 'id')) || `focus_${Date.now()}`,
      eyebrow: asText(cell(row, '眉题', 'eyebrow')) || '在过去一年中',
      department: '',
      tipTitle: asText(cell(row, '提示标题', 'tip_title')) || '风控提示',
      tip: asText(cell(row, '提示正文', 'tip')),
      metrics,
    }
    const list = focusByDept.get(code) || []
    list.push(report)
    focusByDept.set(code, list)
  }

  const deptRows = sheetToRows(wb, '部门列表')
  const departments: CampaignDepartment[] = deptRows.map((row, index) => {
    const code = asText(cell(row, '部门编码', 'dept_code', '编码'))
    const name = asText(cell(row, '部门名称', 'dept_name', '名称'))
    const includeRaw = asText(cell(row, '是否部门聚焦', 'include_dept_focus', '聚焦'))
    const include =
      includeRaw === '是' ||
      includeRaw.toLowerCase() === 'true' ||
      includeRaw === '1' ||
      includeRaw.toLowerCase() === 'yes'
    const reports = (focusByDept.get(code) || []).map((r) => ({
      ...r,
      department: name,
    }))
    return {
      dept_code: code,
      dept_name: name,
      recipient_name: asText(cell(row, '接收人', 'recipient_name')) || name,
      role_key: asText(cell(row, '角色', 'role_key')) || 'manager',
      sort_order: index,
      overrides: include
        ? {
            include_dept_focus: true,
            details_data: { dept_focus_reports: reports },
          }
        : { include_dept_focus: false },
    }
  }).filter((d) => d.dept_code && d.dept_name)

  return { sharedPatch, departments }
}

export function applySharedPatch(payload: BillData, patch: Partial<BillData>): BillData {
  const next: BillData = structuredClone(payload)
  if (patch.user) {
    next.user = { ...next.user, ...patch.user }
  }
  if (patch.summary_data) {
    next.summary_data = { ...next.summary_data, ...patch.summary_data }
  }
  if (patch.page_config?.[0]?.type === 'cover') {
    const cover = next.page_config.find((p) => p.type === 'cover')
    if (cover && cover.type === 'cover') {
      Object.assign(cover, patch.page_config[0])
    }
  }
  if (patch.details_data?.compliance_education?.intro) {
    if (!next.details_data.compliance_education) {
      next.details_data.compliance_education = { intro: '', items: [] }
    }
    next.details_data.compliance_education.intro =
      patch.details_data.compliance_education.intro
  }
  return next
}
