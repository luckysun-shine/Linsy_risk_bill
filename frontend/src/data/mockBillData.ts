import type { BillData } from '@/types/bill'
import { mockRectificationOverview } from '@/data/rectificationOverviewData'
import { mockComplianceEducation } from '@/data/complianceEducationData'
import { mockDeptBattleReport } from '@/data/deptBattleReportData'
import { mockRiskReport } from '@/data/riskReportData'
import { mockRiskClassificationTree } from '@/data/riskClassificationTreeData'
import { mockDeptFocusReports } from '@/data/deptFocusData'

/** Mock 默认 role_key；部门发布链接也会使用 manager */



/** 深空追光主题色板（对齐设计系统 chart 色阶） */
const RISK_COLORS: Record<string, string> = {
  渠道管理: '#20B2AA',
  供应链管理: '#FFD700',
  人力资源管理: '#40E0D0',
  财务管理: '#FF8C00',
  工程管理: '#1A9E96',
  行政管理: '#5CE8DC',
  物流仓储管理: '#0A5C58',
  信数管理: '#FFE566',
  品质管理: '#148F88',
  研发管理: '#CC9A06',
  营销管理: '#32C8B8',
  采购与付款: '#E6A800',
  产品管理: '#7AE8DC',
  信息系统: '#0A3D42',
}

const riskCategories = [
  { name: '渠道管理', value: 27.5 },
  { name: '供应链管理', value: 19.64 },
  { name: '人力资源管理', value: 13.21 },
  { name: '财务管理', value: 10.36 },
  { name: '工程管理', value: 6.07 },
  { name: '行政管理', value: 5.0 },
  { name: '物流仓储管理', value: 4.29 },
  { name: '信数管理', value: 3.93 },
  { name: '品质管理', value: 3.21 },
  { name: '研发管理', value: 2.86 },
  { name: '营销管理', value: 1.43 },
  { name: '采购与付款', value: 1.43 },
  { name: '产品管理', value: 0.71 },
  { name: '信息系统', value: 0.36 },
].map((item) => ({
  ...item,
  color: RISK_COLORS[item.name] ?? '#5B9BD5',
}))

const RECTIFICATION_COLORS: Record<string, string> = {
  其他整改: '#20B2AA',
  挽损整改: '#FF8C00',
  流程整改: '#40E0D0',
  系统整改: '#FFD700',
  追责通报: '#0A5C58',
}

const rectificationCategories = [
  { name: '其他整改', value: 35 },
  { name: '挽损整改', value: 28 },
  { name: '流程整改', value: 24 },
  { name: '系统整改', value: 12 },
  { name: '追责通报', value: 1 },
].map((item) => ({
  ...item,
  color: RECTIFICATION_COLORS[item.name] ?? '#5B9BD5',
}))

export const mockBillData: BillData = {
  user: {
    name: '张三',
    emp_id: 'XM882',
    department: '风控监察部',
    role_key: 'manager',
    company: '林氏家居',
    days: 1280,
  },
  summary_data: {
    risk_score: 92,
    rank_percent: 90,
    total_models: 1254,
    savings: 128500,
    keyword: '风险防控守护者',
    risk_level: '优',
  },
  details_data: {
    risk_categories: riskCategories,
    rectification_categories: rectificationCategories,
    rectification_overview: mockRectificationOverview,
    radar: {
      dimensions: ['财务风控', '流程合规', '信息安全', '运营效率', '创新合规'],
      values: [85, 72, 90, 78, 88],
    },
    compliance_education: mockComplianceEducation,
    milestones: [
      { date: '2025-03-12', title: '首例交叉预警', amount: 12000 },
      { date: '2025-08-15', title: '最大单笔预警', amount: 52000 },
      { date: '2025-11-02', title: '批量异常拦截', amount: 38000 },
    ],
    dept_battle_report: mockDeptBattleReport,
    violations: [
      { name: '虚假报销', count: 23 },
      { name: '飞单', count: 15 },
      { name: '违规返利', count: 12 },
      { name: '合同篡改', count: 8 },
      { name: '数据泄露', count: 6 },
    ],
    risk_report: mockRiskReport,
    risk_classification_tree: mockRiskClassificationTree,
    dept_focus_reports: mockDeptFocusReports,
  },
  page_config: [
    {
      type: 'cover',
      headline: '2025年风险账单来啦!',
      title: '征途坎坷成画',
      subtitle: '沿途波澜皆景',
    },
    { type: 'risk_pie' },
    { type: 'risk_rectification' },
    { type: 'stats' },
    { type: 'milestone' },
    { type: 'dept_focus', focusId: 'audit' },
    { type: 'dept_focus', focusId: 'supervision' },
    { type: 'dept_focus', focusId: 'control' },
    { type: 'cluster' },
    { type: 'achievement' },
  ],
  assets: {
    bgm: '/audio/bgm.mp3',
    preload_images: [],
  },
}
