import type { RectificationOverviewData } from '@/types/bill'

/** 风险整改概况 — 设计稿 mock 数据 */
export const mockRectificationOverview: RectificationOverviewData = {
  avg_rate_note: '平均关闭率为一级部门维度平均关闭情况，同整体任务关闭率有差异',
  year_section: {
    title: '25年整改详情',
    avg_close_rate: 81,
    departments: [
      { name: '总经办', problem: 2, should_rectify: 1, closed: 1, close_rate: 100 },
      { name: '财经中心', problem: 21, should_rectify: 12, closed: 11, close_rate: 91.7 },
      { name: '人力资源中心', problem: 8, should_rectify: 6, closed: 5, close_rate: 83.3 },
      { name: '品牌市场中心', problem: 15, should_rectify: 11, closed: 10, close_rate: 90.9 },
      { name: '产品中心', problem: 26, should_rectify: 21, closed: 19, close_rate: 90.5 },
      { name: '整家事业部', problem: 18, should_rectify: 14, closed: 13, close_rate: 92.9 },
      { name: '大家居新零售', problem: 64, should_rectify: 55, closed: 51, close_rate: 92.7 },
      { name: '电商事业部', problem: 49, should_rectify: 41, closed: 37, close_rate: 90.2 },
      { name: '新媒体事业部', problem: 12, should_rectify: 9, closed: 8, close_rate: 88.9 },
      { name: '海外经营中心', problem: 10, should_rectify: 8, closed: 7, close_rate: 87.5 },
      { name: '海外B2B事业部', problem: 7, should_rectify: 5, closed: 5, close_rate: 100 },
      { name: '海外B2C事业部', problem: 9, should_rectify: 7, closed: 6, close_rate: 85.7 },
      { name: '供应链产品中心', problem: 14, should_rectify: 11, closed: 10, close_rate: 90.9 },
      { name: '全球交付中心', problem: 22, should_rectify: 18, closed: 16, close_rate: 88.9 },
      { name: '质量中心', problem: 11, should_rectify: 9, closed: 8, close_rate: 88.9 },
    ],
  },
  history_section: {
    title: '历史整改详情',
    avg_close_rate: 98.9,
    departments: [
      { name: '总经办', problem: 12, should_rectify: 10, closed: 10, close_rate: 100 },
      { name: '财经中心', problem: 86, should_rectify: 72, closed: 71, close_rate: 98.6 },
      { name: '人力资源中心', problem: 45, should_rectify: 38, closed: 38, close_rate: 100 },
      { name: '品牌市场中心', problem: 62, should_rectify: 54, closed: 53, close_rate: 98.1 },
      { name: '产品中心', problem: 98, should_rectify: 82, closed: 81, close_rate: 98.8 },
      { name: '整家事业部', problem: 74, should_rectify: 65, closed: 64, close_rate: 98.5 },
      { name: '大家居新零售', problem: 186, should_rectify: 162, closed: 160, close_rate: 98.8 },
      { name: '电商事业部', problem: 152, should_rectify: 128, closed: 127, close_rate: 99.2 },
      { name: '新媒体事业部', problem: 38, should_rectify: 32, closed: 32, close_rate: 100 },
      { name: '海外经营中心', problem: 42, should_rectify: 36, closed: 35, close_rate: 97.2 },
      { name: '海外B2B事业部', problem: 28, should_rectify: 24, closed: 24, close_rate: 100 },
      { name: '海外B2C事业部', problem: 35, should_rectify: 30, closed: 29, close_rate: 96.7 },
      { name: '供应链产品中心', problem: 58, should_rectify: 48, closed: 48, close_rate: 100 },
      { name: '全球交付中心', problem: 92, should_rectify: 78, closed: 77, close_rate: 98.7 },
      { name: '质量中心', problem: 48, should_rectify: 40, closed: 40, close_rate: 100 },
      { name: '审计监察', problem: 22, should_rectify: 18, closed: 18, close_rate: 100 },
    ],
  },
  alert: {
    year: 2025,
    should_rectify_total: 116,
    closed_total: 108,
    close_rate: 93.1,
    top_departments: ['大家居新零售', '产品中心', '财经中心'],
    salvage_amount: 10_300_000,
    salvage_display: '1030万元',
    report_date: '2025.12',
  },
}

export const RECT_CHART_COLORS = {
  problem: '#FFD700',
  shouldRectify: '#0A5C58',
  closed: '#40E0D0',
  closeRateLine: '#1A9E96',
  avgLine: '#FF8C00',
} as const

/** 横向滚动时每列宽度，保证表头与数字可读 */
export const RECT_COL_WIDTH = 58
export const RECT_LABEL_WIDTH = 56
