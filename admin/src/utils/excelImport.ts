import * as XLSX from 'xlsx'
import type {
  BillData,
  CampaignDepartment,
  ComplianceEducationItem,
  DeptBattleSection,
  DeptFocusReport,
  MetricPart,
  RectificationDeptRow,
  RiskCategoryItem,
} from '@/types/bill'

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

export function parseMetricLine(text: string): MetricPart[] {
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

function parseCategoryRows(rows: Record<string, unknown>[]): RiskCategoryItem[] {
  return rows
    .map((row) => {
      const name = asText(cell(row, '名称', 'name', '分类'))
      if (!name) return null
      return {
        name,
        value: asNumber(cell(row, '占比', 'value', '比例')),
        color: asText(cell(row, '颜色', 'color')) || undefined,
      }
    })
    .filter(Boolean) as RiskCategoryItem[]
}

function parseRectDeptRows(rows: Record<string, unknown>[]): RectificationDeptRow[] {
  return rows
    .map((row) => {
      const name = asText(cell(row, '部门', 'name', '部门名称'))
      if (!name) return null
      return {
        name,
        problem: asNumber(cell(row, '问题数', 'problem')),
        should_rectify: asNumber(cell(row, '应整改', 'should_rectify')),
        closed: asNumber(cell(row, '已关闭', 'closed')),
        close_rate: asNumber(cell(row, '关闭率', 'close_rate')),
      }
    })
    .filter(Boolean) as RectificationDeptRow[]
}

/** 生成可下载的 Excel 模板（覆盖主要分屏） */
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
    ['battle_subtitle', '监察 · 审计 · 内控，三线协同守住底线', '阻击战副标题'],
    ['avg_rate_note', '平均关闭率为一级部门维度平均关闭情况，同整体任务关闭率有差异', '整改平均关闭率说明'],
    ['alert_year', 2025, '整改警示年份'],
    ['alert_should', 116, '应整改总数'],
    ['alert_closed', 108, '已关闭'],
    ['alert_close_rate', 93.1, '关闭率'],
    ['alert_salvage_display', '1030万元', '挽损展示文案'],
    ['alert_salvage_amount', 10300000, '挽损数值'],
    ['alert_report_date', '2025.12', '报告日期'],
    ['alert_top_departments', '大家居新零售、产品中心、财经中心', '重点部门，顿号分隔'],
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
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(focus), '部门聚焦')

  const riskCats = [
    ['名称', '占比', '颜色'],
    ['渠道管理', 27.5, '#20B2AA'],
    ['供应链管理', 19.64, '#FFD700'],
    ['人力资源管理', 13.21, '#40E0D0'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(riskCats), '风险分类')

  const rectCats = [
    ['名称', '占比', '颜色'],
    ['其他整改', 35, '#20B2AA'],
    ['挽损整改', 28, '#FF8C00'],
    ['流程整改', 24, '#40E0D0'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rectCats), '整改分类')

  const yearRect = [
    ['部门', '问题数', '应整改', '已关闭', '关闭率'],
    ['大家居新零售', 20, 18, 16, 88.9],
    ['产品中心', 15, 14, 13, 92.9],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(yearRect), '整改概况年')

  const historyRect = [
    ['部门', '问题数', '应整改', '已关闭', '关闭率'],
    ['大家居新零售', 40, 38, 35, 92.1],
    ['产品中心', 30, 28, 27, 96.4],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(historyRect), '整改概况史')

  const compliance = [
    ['标题', '段落1', '段落2', '段落3'],
    [
      '宣教矩阵全覆盖',
      '发布廉洁发文 [[13]] 篇（含以案示警 [[2]] 篇）、廉洁视频 [[7]] 篇。',
      '结合“廉洁月”专项活动，实现 [[4700]] 人次参与阅读，覆盖率达 [[69%]] 。',
      '',
    ],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(compliance), '合规数读')

  const battle = [
    ['部门名', '导语', '战绩行1', '战绩行2', '战绩行3', '战绩行4', '战绩行5', '战绩行6'],
    [
      '监察部',
      '监察部在过去的一年里',
      '发起了监察案件 [[78]] 起',
      '共向违规员工发出红牌 [[8]] 张，黄牌 [[1]] 张，蓝牌 [[3]] 张',
      '涉及违规合作商累计 [[20]] 家',
      '累计直接挽回金额 [[357]] 万元',
      '',
      '',
    ],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(battle), '高风险阻击战')

  const riskReport = [
    ['字段', '值', '说明'],
    ['headline', '2025年，我们完善了[[重大风险]]上报与闭环机制', '标题，可用[[]]高亮'],
    ['paragraph_1', '全年重大风险事项关闭率达到 [[96%]]。', '正文段落'],
    ['paragraph_2', '业务协同推进，风险处置时效明显提升。', '正文段落'],
    ['praise_title', '风控点赞', '点赞卡标题'],
    ['praise_body', '感谢各业务伙伴主动报备与高效协同，闭环质量持续提升。', '点赞正文'],
    ['closing_1', '风险常在，治理常新。', '收尾寄语'],
    ['closing_2', '我们与业务一起，把防线筑在事前。', '收尾寄语'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(riskReport), '重大风险')

  const guide = [
    ['说明'],
    ['1. 优先填写「公司公共 / 风险分类 / 整改分类 / 整改概况年 / 整改概况史 / 合规数读」等 Sheet'],
    ['2. 文案中用 [[数字或关键词]] 标记高亮'],
    ['3. 上传后会在页面预览变更摘要，确认后再保存/发布'],
    ['4. 「部门聚焦」仅影响含聚焦的部门链接；CEO 等可在部门列表关闭聚焦'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(guide), '填写说明')

  return wb
}

export function downloadImportTemplate() {
  const wb = buildImportTemplateWorkbook()
  XLSX.writeFile(wb, '风险账单导入模板.xlsx')
}

export interface ImportPreviewSummary {
  sheets: string[]
  changes: string[]
  departmentCount: number
}

export async function parseImportExcel(file: File): Promise<{
  sharedPatch: Partial<BillData>
  departments: CampaignDepartment[]
  summary: ImportPreviewSummary
}> {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })
  const sheets = wb.SheetNames
  const changes: string[] = []

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
    details_data: {
      risk_categories: [],
      radar: { dimensions: [], values: [] },
    },
  }

  if (sharedRows.length) changes.push('更新公司公共信息 / 封面')

  const riskCats = parseCategoryRows(sheetToRows(wb, '风险分类'))
  if (riskCats.length) {
    sharedPatch.details_data!.risk_categories = riskCats
    changes.push(`导入风险分类 ${riskCats.length} 项`)
  }

  const rectCats = parseCategoryRows(sheetToRows(wb, '整改分类'))
  if (rectCats.length) {
    sharedPatch.details_data!.rectification_categories = rectCats
    changes.push(`导入整改分类 ${rectCats.length} 项`)
  }

  const yearDepts = parseRectDeptRows(sheetToRows(wb, '整改概况年'))
  const historyDepts = parseRectDeptRows(sheetToRows(wb, '整改概况史'))
  if (yearDepts.length || historyDepts.length || sharedMap.avg_rate_note || sharedMap.alert_year) {
    sharedPatch.details_data!.rectification_overview = {
      avg_rate_note: asText(sharedMap.avg_rate_note),
      year_section: {
        title: '25年整改详情',
        avg_close_rate: yearDepts.length
          ? Number(
              (
                yearDepts.reduce((s, d) => s + d.close_rate, 0) / yearDepts.length
              ).toFixed(1)
            )
          : 0,
        departments: yearDepts,
      },
      history_section: {
        title: '历史整改详情',
        avg_close_rate: historyDepts.length
          ? Number(
              (
                historyDepts.reduce((s, d) => s + d.close_rate, 0) / historyDepts.length
              ).toFixed(1)
            )
          : 0,
        departments: historyDepts,
      },
      alert: {
        year: asNumber(sharedMap.alert_year, 2025),
        should_rectify_total: asNumber(sharedMap.alert_should),
        closed_total: asNumber(sharedMap.alert_closed),
        close_rate: asNumber(sharedMap.alert_close_rate),
        salvage_display: asText(sharedMap.alert_salvage_display),
        salvage_amount: asNumber(sharedMap.alert_salvage_amount),
        report_date: asText(sharedMap.alert_report_date),
        top_departments: asText(sharedMap.alert_top_departments)
          .split(/[、,，]/)
          .map((s) => s.trim())
          .filter(Boolean),
      },
    }
    changes.push('更新整改概况 / 警示摘要')
  }

  const complianceRows = sheetToRows(wb, '合规数读')
  if (complianceRows.length || sharedMap.compliance_intro) {
    const items: ComplianceEducationItem[] = complianceRows
      .map((row) => {
        const title = asText(cell(row, '标题', 'title'))
        if (!title) return null
        const paragraphs: MetricPart[][] = []
        for (let i = 1; i <= 6; i++) {
          const line = asText(cell(row, `段落${i}`, `paragraph_${i}`, `p${i}`))
          if (line) paragraphs.push(parseMetricLine(line))
        }
        return { title, paragraphs: paragraphs.length ? paragraphs : [[{ text: '' }]] }
      })
      .filter(Boolean) as ComplianceEducationItem[]

    sharedPatch.details_data!.compliance_education = {
      intro: asText(sharedMap.compliance_intro),
      items,
    }
    changes.push(`更新合规数读（${items.length} 条）`)
  }

  const battleRows = sheetToRows(wb, '高风险阻击战')
  if (battleRows.length || sharedMap.battle_subtitle) {
    const departments: DeptBattleSection[] = battleRows
      .map((row) => {
        const name = asText(cell(row, '部门名', 'name', '部门'))
        if (!name) return null
        const lines: MetricPart[][] = []
        for (let i = 1; i <= 8; i++) {
          const line = asText(cell(row, `战绩行${i}`, `line${i}`))
          if (line) lines.push(parseMetricLine(line))
        }
        return {
          name,
          lead: asText(cell(row, '导语', 'lead')),
          lines,
        }
      })
      .filter(Boolean) as DeptBattleSection[]

    sharedPatch.details_data!.dept_battle_report = {
      subtitle: asText(sharedMap.battle_subtitle),
      departments,
      tip: {
        title: '风控提示',
        body: parseMetricLine(
          asText(sharedMap.battle_tip) ||
            '2025 年，一些在管理过程中容易被忽略的员工不当行为和管理风气问题需要引起关注。'
        ),
      },
    }
    changes.push(`更新高风险阻击战（${departments.length} 个部门）`)
  }

  const riskReportRows = sheetToRows(wb, '重大风险')
  if (riskReportRows.length) {
    const map: Record<string, string> = {}
    for (const row of riskReportRows) {
      const key = asText(cell(row, '字段', 'field', 'key'))
      if (!key) continue
      map[key] = asText(cell(row, '值', 'value'))
    }
    const paragraphs: MetricPart[][] = []
    for (let i = 1; i <= 10; i++) {
      const line = map[`paragraph_${i}`] || map[`段落${i}`]
      if (line) paragraphs.push(parseMetricLine(line))
    }
    const closing: string[] = []
    for (let i = 1; i <= 10; i++) {
      const line = map[`closing_${i}`] || map[`寄语${i}`]
      if (line) closing.push(line)
    }
    sharedPatch.details_data!.risk_report = {
      headline: parseMetricLine(map.headline || map['标题'] || ''),
      paragraphs,
      praise: {
        title: map.praise_title || map['点赞标题'] || '风控点赞',
        body: parseMetricLine(map.praise_body || map['点赞正文'] || ''),
      },
      closing,
    }
    changes.push('更新重大风险文案')
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
  const departments: CampaignDepartment[] = deptRows
    .map((row, index) => {
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
    })
    .filter((d) => d.dept_code && d.dept_name)

  if (departments.length) changes.push(`导入部门列表 ${departments.length} 个`)

  return {
    sharedPatch,
    departments,
    summary: {
      sheets,
      changes: changes.length ? changes : ['未识别到有效变更，请检查 Sheet 名称与表头'],
      departmentCount: departments.length,
    },
  }
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

  const details = patch.details_data
  if (!details) return next

  if (details.risk_categories?.length) {
    next.details_data.risk_categories = details.risk_categories
  }
  if (details.rectification_categories?.length) {
    next.details_data.rectification_categories = details.rectification_categories
  }
  if (details.rectification_overview) {
    const current = next.details_data.rectification_overview
    next.details_data.rectification_overview = current
      ? {
          ...current,
          ...details.rectification_overview,
          year_section: {
            ...current.year_section,
            ...details.rectification_overview.year_section,
            departments:
              details.rectification_overview.year_section.departments?.length
                ? details.rectification_overview.year_section.departments
                : current.year_section.departments,
          },
          history_section: {
            ...current.history_section,
            ...details.rectification_overview.history_section,
            departments:
              details.rectification_overview.history_section.departments?.length
                ? details.rectification_overview.history_section.departments
                : current.history_section.departments,
          },
          alert: {
            ...current.alert,
            ...details.rectification_overview.alert,
          },
        }
      : details.rectification_overview
  }
  if (details.compliance_education) {
    next.details_data.compliance_education = {
      intro:
        details.compliance_education.intro ||
        next.details_data.compliance_education?.intro ||
        '',
      items: details.compliance_education.items?.length
        ? details.compliance_education.items
        : next.details_data.compliance_education?.items || [],
    }
  }
  if (details.dept_battle_report) {
    next.details_data.dept_battle_report = {
      ...(next.details_data.dept_battle_report || { departments: [] }),
      ...details.dept_battle_report,
      departments: details.dept_battle_report.departments?.length
        ? details.dept_battle_report.departments
        : next.details_data.dept_battle_report?.departments || [],
    }
  }
  if (details.risk_report) {
    next.details_data.risk_report = details.risk_report
  }

  return next
}
