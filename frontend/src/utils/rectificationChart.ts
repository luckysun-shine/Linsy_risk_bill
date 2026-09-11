import type { RectificationDeptRow, RectificationOverviewSection } from '@/types/bill'
import { RECT_CHART_COLORS } from '@/data/rectificationOverviewData'

export type RectificationChartOptions = {
  compact?: boolean
  /** 每列像素宽，与表格列对齐 */
  colWidth?: number
  /** 左侧指标列宽 */
  labelWidth?: number
  showAxisLabel?: boolean
}

export function buildRectificationChartOption(
  section: RectificationOverviewSection,
  opts: RectificationChartOptions = {}
) {
  const compact = opts.compact ?? false
  const colWidth = opts.colWidth ?? 56
  const showAxisLabel = opts.showAxisLabel ?? true
  const categories = section.departments.map((d) => d.name)
  const maxCount = Math.max(
    ...section.departments.flatMap((d) => [d.problem, d.should_rectify, d.closed]),
    1
  )
  const yMax = Math.ceil(maxCount * 1.12)
  const barMaxWidth = Math.max(5, Math.min(compact ? 9 : 12, colWidth * 0.28))

  return {
    animation: true,
    animationDuration: 700,
    grid: {
      left: compact ? 28 : 32,
      right: 8,
      top: 12,
      bottom: showAxisLabel ? (compact ? 42 : 48) : 8,
      containLabel: false,
    },
    legend: { show: false },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(32, 178, 170, 0.25)',
      borderWidth: 1,
      textStyle: { color: '#052e2c', fontSize: 11, fontWeight: 600 },
      extraCssText: 'border-radius:10px;box-shadow:0 8px 20px rgba(4,31,36,0.12);',
    },
    xAxis: {
      type: 'category' as const,
      data: categories,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: showAxisLabel
        ? {
            show: true,
            interval: 0,
            rotate: 40,
            color: 'rgba(5, 46, 44, 0.72)',
            fontSize: compact ? 9 : 10,
            fontWeight: 600,
            width: colWidth,
            overflow: 'truncate' as const,
            ellipsis: '…',
          }
        : { show: false },
    },
    yAxis: [
      {
        type: 'value' as const,
        min: 0,
        max: yMax,
        splitNumber: 3,
        axisLabel: {
          color: 'rgba(5, 46, 44, 0.45)',
          fontSize: 9,
          fontWeight: 600,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: 'rgba(10, 77, 100, 0.08)', type: 'dashed' as const },
        },
      },
      {
        type: 'value' as const,
        min: 0,
        max: 100,
        show: false,
      },
    ],
    series: [
      {
        name: '问题',
        type: 'bar' as const,
        barGap: '20%',
        barCategoryGap: '28%',
        data: section.departments.map((d) => d.problem),
        itemStyle: {
          color: RECT_CHART_COLORS.problem,
          borderRadius: [3, 3, 0, 0],
        },
        barMaxWidth,
      },
      {
        name: '应整改',
        type: 'bar' as const,
        data: section.departments.map((d) => d.should_rectify),
        itemStyle: {
          color: RECT_CHART_COLORS.shouldRectify,
          borderRadius: [3, 3, 0, 0],
        },
        barMaxWidth,
      },
      {
        name: '已关闭',
        type: 'bar' as const,
        data: section.departments.map((d) => d.closed),
        itemStyle: {
          color: RECT_CHART_COLORS.closed,
          borderRadius: [3, 3, 0, 0],
        },
        barMaxWidth,
      },
      {
        name: '关闭率',
        type: 'line' as const,
        yAxisIndex: 1,
        data: section.departments.map((d) => d.close_rate),
        symbol: 'circle',
        symbolSize: compact ? 4 : 5,
        lineStyle: {
          type: 'dashed' as const,
          color: RECT_CHART_COLORS.closeRateLine,
          width: 1.5,
        },
        itemStyle: { color: RECT_CHART_COLORS.closeRateLine },
        z: 5,
      },
      {
        name: '平均关闭率',
        type: 'line' as const,
        yAxisIndex: 1,
        data: section.departments.map(() => section.avg_close_rate),
        symbol: 'none',
        lineStyle: {
          type: 'dashed' as const,
          color: RECT_CHART_COLORS.avgLine,
          width: 1.4,
        },
        itemStyle: { color: RECT_CHART_COLORS.avgLine },
        z: 4,
      },
    ],
  }
}

export function formatCloseRate(rate: number): string {
  if (Number.isInteger(rate) || rate % 1 === 0) return `${rate}%`
  return `${rate.toFixed(1)}%`
}

export function formatDeptCell(row: RectificationDeptRow, field: keyof RectificationDeptRow): string {
  if (field === 'close_rate') return formatCloseRate(row.close_rate)
  if (field === 'name') return row.name
  return String(row[field])
}

/** 部门名两行展示，便于窄列可读 */
export function formatDeptLabel(name: string): string {
  if (name.length <= 4) return name
  if (name.length <= 6) return `${name.slice(0, 3)}\n${name.slice(3)}`
  return `${name.slice(0, 4)}\n${name.slice(4, 8)}${name.length > 8 ? '…' : ''}`
}
