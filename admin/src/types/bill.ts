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

export interface BillUser {
  name: string
  emp_id: string
  department: string
  role_key: string
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

export interface MetricPart {
  text: string
  accent?: boolean
  strong?: boolean
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

export interface RectificationOverviewData {
  year_section: RectificationOverviewSection
  history_section: RectificationOverviewSection
  alert: {
    year: number
    should_rectify_total: number
    closed_total: number
    close_rate: number
    top_departments: string[]
    salvage_amount: number
    salvage_display: string
    report_date: string
  }
  avg_rate_note: string
}

export interface ComplianceEducationItem {
  title: string
  paragraphs: MetricPart[][]
}

export interface ComplianceEducationData {
  intro: string
  items: ComplianceEducationItem[]
}

export interface DeptBattleSection {
  name: string
  lead: string
  lines: MetricPart[][]
}

export interface DeptBattleReportData {
  subtitle?: string
  departments: DeptBattleSection[]
  tip?: { title: string; body: MetricPart[] }
}

export interface RiskReportData {
  headline: MetricPart[]
  paragraphs: MetricPart[][]
  praise: { title: string; body: MetricPart[] }
  closing: string[]
}

export interface TeamRankItem {
  department: string
  risk_score: number
  rank: number
}

export interface RiskTreeCategoryNode {
  name: string
  icon: string
  children: string[]
}

export interface RiskClassificationTreeData {
  rootTitle: string
  rectification: { title: string; icon: string; items: string[] }
  risk: {
    title: string
    icon: string
    columns: Array<{ up: RiskTreeCategoryNode; down?: RiskTreeCategoryNode }>
    terminal: RiskTreeCategoryNode
  }
}

export interface DeptFocusReport {
  id: string
  eyebrow: string
  department: string
  metrics: MetricPart[][]
  tip: string
  tipTitle?: string
}

export interface BillDetailsData {
  risk_categories: RiskCategoryItem[]
  rectification_categories?: RiskCategoryItem[]
  rectification_overview?: RectificationOverviewData
  radar?: { dimensions: string[]; values: number[] }
  compliance_education?: ComplianceEducationData
  milestones?: Array<{ date: string; title: string; amount?: number }>
  dept_battle_report?: DeptBattleReportData
  violations?: Array<{ name: string; count: number }>
  risk_report?: RiskReportData
  risk_classification_tree?: RiskClassificationTreeData
  dept_focus_reports?: DeptFocusReport[]
  team_rank?: TeamRankItem[]
}

export interface CoverPageConfig {
  type: 'cover'
  headline?: string
  title?: string
  subtitle?: string
  greeting?: string
}

export type PageConfigItem =
  | CoverPageConfig
  | { type: PageType; focusId?: string; title?: string; desc?: string }

export interface BillData {
  user: BillUser
  summary_data: BillSummaryData
  details_data: BillDetailsData
  page_config: PageConfigItem[]
  assets?: { bgm?: string; preload_images?: string[] }
}

export interface CampaignSummary {
  id: string
  year: number
  title: string
  status: 'draft' | 'published'
  department_count: number
  updated_at: string
}

export interface CampaignDepartment {
  id?: string
  dept_code: string
  dept_name: string
  recipient_name?: string | null
  role_key: string
  sort_order: number
  overrides: Record<string, unknown>
  link_id?: string | null
  url?: string | null
  token?: string | null
}
