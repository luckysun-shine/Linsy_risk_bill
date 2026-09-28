<template>
  <section class="rect-block" :class="{ 'rect-block--compact': compact }">
    <div class="rect-block__head">
      <h3 class="rect-block__title">{{ section.title }}</h3>
      <span class="rect-block__avg">均关 {{ formatCloseRate(section.avg_close_rate) }}</span>
    </div>

    <div class="rect-block__legend">
      <span class="leg"><i class="dot dot-problem" />问题</span>
      <span class="leg"><i class="dot dot-should" />应整改</span>
      <span class="leg"><i class="dot dot-closed" />已关闭</span>
      <span class="leg"><i class="line line-rate" />关闭率</span>
    </div>

    <div ref="scrollRef" class="rect-block__scroll">
      <div class="rect-block__chart-wrap" :style="{ width: `${chartWidth}px` }">
        <div ref="chartRef" class="rect-block__chart" :style="{ height: `${chartHeight}px` }" />
      </div>
    </div>

    <div class="rect-table-wrap">
      <div class="rect-table-labels" aria-hidden="false">
        <div class="label-cell label-cell--head">部门</div>
        <div
          v-for="row in metricRows"
          :key="row.key"
          class="label-cell"
          :class="{ 'label-cell--rate': row.key === 'rate' }"
        >
          {{ row.label }}
        </div>
      </div>

      <div class="rect-table-scroll" @scroll="onTableScroll">
        <table class="rect-table" :style="{ width: `${tableWidth}px` }">
          <thead>
            <tr>
              <th
                v-for="dept in section.departments"
                :key="dept.name"
                class="col-head"
                :title="dept.name"
              >
                <span class="col-head__text">{{ formatDeptLabel(dept.name) }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="dept in section.departments" :key="`${dept.name}-p`">
                {{ dept.problem }}
              </td>
            </tr>
            <tr>
              <td v-for="dept in section.departments" :key="`${dept.name}-s`">
                {{ dept.should_rectify }}
              </td>
            </tr>
            <tr>
              <td v-for="dept in section.departments" :key="`${dept.name}-c`">
                {{ dept.closed }}
              </td>
            </tr>
            <tr class="row-rate">
              <td v-for="dept in section.departments" :key="`${dept.name}-r`">
                {{ formatCloseRate(dept.close_rate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="rect-block__hint">左右滑动查看全部部门</p>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import type { RectificationOverviewSection } from '@/types/bill'
import { RECT_COL_WIDTH } from '@/data/rectificationOverviewData'
import {
  buildRectificationChartOption,
  formatCloseRate,
  formatDeptLabel,
} from '@/utils/rectificationChart'
import { echarts, type ECharts } from '@/utils/echartsSetup'

const props = defineProps<{
  section: RectificationOverviewSection
  active?: boolean
  chartHeight?: number
  compact?: boolean
}>()

const scrollRef = ref<HTMLElement | null>(null)
const chartRef = ref<HTMLElement | null>(null)
let chart: ECharts | null = null

const compact = computed(() => props.compact ?? false)
const chartHeight = computed(() => props.chartHeight ?? (compact.value ? 120 : 168))
const colWidth = RECT_COL_WIDTH

const chartWidth = computed(() => props.section.departments.length * colWidth + 40)
const tableWidth = computed(() => props.section.departments.length * colWidth)

const metricRows = [
  { key: 'problem', label: '问题数' },
  { key: 'should', label: '应整改' },
  { key: 'closed', label: '已关闭' },
  { key: 'rate', label: '关闭率' },
] as const

function onTableScroll(e: Event) {
  const el = e.target as HTMLElement
  if (scrollRef.value && Math.abs(scrollRef.value.scrollLeft - el.scrollLeft) > 1) {
    scrollRef.value.scrollLeft = el.scrollLeft
  }
}

function onChartScroll() {
  const chartScroll = scrollRef.value
  const tableScroll = chartScroll
    ?.closest('.rect-block')
    ?.querySelector('.rect-table-scroll') as HTMLElement | null
  if (!chartScroll || !tableScroll) return
  if (Math.abs(tableScroll.scrollLeft - chartScroll.scrollLeft) > 1) {
    tableScroll.scrollLeft = chartScroll.scrollLeft
  }
}

function bindScrollSync() {
  const chartScroll = scrollRef.value
  if (!chartScroll) return
  chartScroll.removeEventListener('scroll', onChartScroll)
  chartScroll.addEventListener('scroll', onChartScroll, { passive: true })
}

function renderChart() {
  if (!chartRef.value || !props.active) return
  chart = chart ?? echarts.init(chartRef.value)
  chart.setOption(
    buildRectificationChartOption(props.section, {
      compact: compact.value,
      colWidth,
      labelWidth: 32,
      showAxisLabel: true,
    }),
    { notMerge: true }
  )
  chart.resize()
}

function disposeChart() {
  chart?.dispose()
  chart = null
}

watch(
  () => props.active,
  async (active) => {
    if (active) {
      await nextTick()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          renderChart()
          bindScrollSync()
        })
      })
    } else {
      disposeChart()
    }
  },
  { immediate: true }
)

watch([() => props.section, compact, chartHeight], async () => {
  if (props.active) {
    await nextTick()
    renderChart()
    bindScrollSync()
  }
})

onUnmounted(() => {
  scrollRef.value?.removeEventListener('scroll', onChartScroll)
  disposeChart()
})

defineExpose({ renderChart, scrollRef })
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.rect-block {
  flex-shrink: 0;
  padding: 12px 10px 10px;
  border-radius: 16px;
  @include bill-glass-inset;
}

.rect-block__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.rect-block__title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 800;
  color: $bill-brand-dark;
  letter-spacing: 0.3px;
}

.rect-block__avg {
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: var(--text-2xs);
  font-weight: 800;
  color: #8c5d00;
  background: rgba(255, 215, 0, 0.22);
  border: 1px solid rgba(255, 215, 0, 0.45);
  white-space: nowrap;
}

.rect-block__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-bottom: var(--space-1);
}

.leg {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-2xs);
  font-weight: 700;
  color: #064057;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-problem { background: #ffb703; }
.dot-should { background: #0a5c58; }
.dot-closed { background: #00c4c7; }

.line {
  width: 12px;
  height: 0;
  border-top: 2px dashed currentColor;
  flex-shrink: 0;
}

.line-rate {
  color: #00a896;
}

.rect-block__scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  margin: 0 -2px;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 196, 199, 0.35);
    border-radius: 3px;
  }
}

.rect-block__chart-wrap {
  min-width: 100%;
}

.rect-block__chart {
  width: 100%;
}

.rect-table-wrap {
  display: flex;
  align-items: stretch;
  margin-top: 6px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.28);
}

.rect-table-labels {
  flex: 0 0 58px;
  width: 58px;
  background: rgba(225, 246, 244, 0.48);
  border-right: 1px solid rgba(0, 196, 199, 0.25);
  z-index: 2;
  box-shadow: 2px 0 8px rgba(2, 18, 38, 0.05);
}

.label-cell {
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 0 6px;
  font-size: var(--text-2xs);
  font-weight: 800;
  color: #053b4f;
  border-bottom: 1px solid rgba(10, 77, 100, 0.1);
  box-sizing: border-box;

  &--head {
    min-height: 40px;
    background: rgba(200, 240, 236, 0.95);
    justify-content: center;
    text-align: center;
    color: $bill-brand-dark;
  }

  &--rate {
    border-bottom: none;
    color: #08615a;
  }

  &:nth-child(odd):not(.label-cell--head) {
    background: rgba(234, 250, 248, 0.65);
  }
}

.rect-table-scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  background: transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 196, 199, 0.45);
    border-radius: 4px;
  }
}

.rect-table {
  border-collapse: collapse;
  table-layout: fixed;
  font-size: var(--text-xs);
  color: #042533;

  th,
  td {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
    border-bottom: 1px solid rgba(10, 77, 100, 0.08);
    padding: 0 2px;
    text-align: center;
    vertical-align: middle;
    font-weight: 700;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    box-sizing: border-box;
  }

  thead th {
    height: 40px;
    background: rgba(240, 252, 250, 0.85);
    border-bottom: 1px solid rgba(0, 196, 199, 0.25);
    color: $bill-brand-dark;
    font-weight: 800;
  }

  tbody td {
    height: 28px;
  }

  tbody tr:nth-child(odd) td {
    background: rgba(250, 255, 254, 0.55);
  }

  tbody tr:nth-child(even) td {
    background: rgba(255, 255, 255, 0.35);
  }

  .col-head__text {
    display: block;
    white-space: pre-line;
    line-height: 1.15;
    font-size: var(--text-2xs);
    font-weight: 800;
  }

  .row-rate td {
    color: #08615a;
    font-weight: 800;
    border-bottom: none;
  }
}

.rect-block__hint {
  margin: 6px 0 0;
  text-align: center;
  font-size: var(--text-2xs);
  font-weight: 700;
  color: #07475e;
  letter-spacing: 0.3px;
}

.rect-block--compact {
  padding: 8px 6px 6px;

  .rect-block__title {
    font-size: 0.86rem;
  }

  .rect-block__avg {
    font-size: 0.58rem;
    padding: 1px 6px;
  }

  .leg {
    font-size: 0.56rem;
  }

  .rect-table-labels {
    flex-basis: 52px;
    width: 52px;
  }

  .label-cell {
    font-size: 0.56rem;
    min-height: 26px;

    &--head {
      min-height: 36px;
    }
  }

  .rect-table {
    font-size: 0.62rem;

    thead th {
      height: 36px;
    }

    tbody td {
      height: 26px;
    }

    .col-head__text {
      font-size: 0.5rem;
    }
  }
}

.rect-block--compact {
  padding: 8px 6px 6px;

  .rect-block__title {
    font-size: 0.86rem;
  }

  .rect-block__avg {
    font-size: 0.58rem;
    padding: 1px 6px;
  }

  .leg {
    font-size: 0.56rem;
  }

  .rect-table-labels {
    flex-basis: 52px;
    width: 52px;
  }

  .label-cell {
    font-size: 0.56rem;
    min-height: 26px;

    &--head {
      min-height: 36px;
    }
  }

  .rect-table {
    font-size: 0.62rem;

    thead th {
      height: 36px;
    }

    tbody td {
      height: 26px;
    }

    .col-head__text {
      font-size: 0.5rem;
    }
  }
}
</style>
