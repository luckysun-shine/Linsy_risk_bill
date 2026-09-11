export type PageType =
  | 'cover'
  | 'stats'
  | 'risk_pie'
  | 'risk_rectification'
  | 'placeholder'
  | 'poster'
  | 'milestone'
  | 'dept_focus'
  | 'cluster'
  | 'achievement'
  | 'manager'

export interface SlideProps {
  slideIndex: number
}

export interface BillUser {
  name: string
  emp_id: string
  department: string
  role_key: 'staff' | 'manager' | string
  company: string
  days: number
}

export interface BillSummaryData {
  risk_score: number
  rank_percent: number
  total_models: number
  savings: number
  keyword: string
  risk_level: string
}

export interface RiskCategoryItem {
  name: string
  value: number
  color?: string
}

export interface RectificationDeptRow {
  name: string
  problem: number
  should_rectify: number
  closed: number
  close_rate: number
}

export interface RectificationOverviewSection {
  title: string
  avg_close_rate: number
  departments: RectificationDeptRow[]
}

export interface RectificationAlertData {
  year: number
  should_rectify_total: number
  closed_total: number
  close_rate: number
  top_departments: string[]
  salvage_amount: number
  salvage_display: string
  report_date: string
}

export interface RectificationOverviewData {
  year_section: RectificationOverviewSection
  history_section: RectificationOverviewSection
  alert: RectificationAlertData
  avg_rate_note: string
}

export interface RectificationCategoryItem {
  name: string
  value: number
  color?: string
}

export interface RadarData {
  dimensions: string[]
  values: number[]
}

/** 合规数读 / 廉洁宣教成果 */
export interface ComplianceEducationMetricPart {
  text: string
  accent?: boolean
}

export interface ComplianceEducationItem {
  title: string
  paragraphs: ComplianceEducationMetricPart[][]
}

export interface ComplianceEducationData {
  intro: string
  items: ComplianceEducationItem[]
}

export interface MilestoneItem {
  date: string
  title: string
  amount?: number
}

/** 高风险阻击战 — 三部门年度战绩 */
export interface DeptBattleMetricPart {
  text: string
  accent?: boolean
}

export interface DeptBattleSection {
  name: string
  lead: string
  lines: DeptBattleMetricPart[][]
}

export interface DeptBattleReportData {
  subtitle?: string
  departments: DeptBattleSection[]
  tip?: {
    title: string
    body: DeptBattleMetricPart[]
  }
}

export interface ViolationItem {
  name: string
  count: number
}

/** 重大风险上报 / 风控点赞 */
export interface RiskReportMetricPart {
  text: string
  accent?: boolean
  strong?: boolean
}

export interface RiskReportData {
  headline: RiskReportMetricPart[]
  paragraphs: RiskReportMetricPart[][]
  praise: {
    title: string
    body: RiskReportMetricPart[]
  }
  closing: string[]
}

export interface TeamRankItem {
  department: string
  risk_score: number
  rank: number
}

/** 风控分类宣导树 — 叶子分类节点 */
export interface RiskTreeCategoryNode {
  name: string
  icon: string
  children: string[]
}

export interface RiskTreeColumn {
  up: RiskTreeCategoryNode
  down?: RiskTreeCategoryNode
}

export interface RiskClassificationTreeData {
  rootTitle: string
  rectification: {
    title: string
    icon: string
    items: string[]
  }
  risk: {
    title: string
    icon: string
    columns: RiskTreeColumn[]
    terminal: RiskTreeCategoryNode
  }
}

/** 部门年度聚焦页（审计 / 监察 / 内控） */
export interface DeptFocusMetricPart {
  text: string
  accent?: boolean
}

export interface DeptFocusReport {
  id: string
  eyebrow: string
  department: string
  metrics: DeptFocusMetricPart[][]
  tip: string
  tipTitle?: string
}

export interface BillDetailsData {
  risk_categories: RiskCategoryItem[]
  rectification_categories?: RectificationCategoryItem[]
  rectification_overview?: RectificationOverviewData
  radar: RadarData
  compliance_education?: ComplianceEducationData
  milestones?: MilestoneItem[]
  dept_battle_report?: DeptBattleReportData
  violations?: ViolationItem[]
  risk_report?: RiskReportData
  risk_classification_tree?: RiskClassificationTreeData
  dept_focus_reports?: DeptFocusReport[]
  team_rank?: TeamRankItem[]
}

export interface PageConfigBase {
  type: PageType
}

export interface PlaceholderPageConfig extends PageConfigBase {
  type: 'placeholder'
  title?: string
  desc?: string
  char_image?: string
}

export interface CoverPageConfig extends PageConfigBase {
  type: 'cover'
  headline?: string
  title?: string
  subtitle?: string
  greeting?: string
}

export interface DeptFocusPageConfig extends PageConfigBase {
  type: 'dept_focus'
  /** 对应 details_data.dept_focus_reports[].id */
  focusId: string
}

export type PageConfigItem =
  | CoverPageConfig
  | PageConfigBase
  | PlaceholderPageConfig
  | DeptFocusPageConfig

export interface BillData {
  user: BillUser
  summary_data: BillSummaryData
  details_data: BillDetailsData
  page_config: PageConfigItem[]
  assets?: {
    bgm?: string
    preload_images?: string[]
  }
}

export type TemplateVars = Record<string, string | number | undefined | null>
