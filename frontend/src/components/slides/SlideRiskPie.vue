<template>
  <SlideShell
    :character="isNarrow ? 'none' : 'detail2'"
    char-position="bottom-right"
    overlay="none"
    sky-variant="risk_pie"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-risk-pie" :class="{ 'slide-risk-pie--compact': isNarrow }">
      <h1 class="page-headline">让我们一起来看看这份风险账单</h1>

      <div class="bill-frame">
        <div class="bill-slot" aria-hidden="true" />
        <div ref="billPaperRef" class="bill-paper" data-bill-scroll>
          <section class="data-section">
            <div class="section-head">
              <span class="grid-icon" aria-hidden="true">
                <i class="sq sq-yellow" />
                <i class="sq sq-green" />
                <i class="sq sq-blue" />
                <i class="sq sq-red" />
              </span>
              <h2>风险分类占比</h2>
              <span class="section-badge">{{ riskRanks.length }} 类</span>
            </div>

            <div class="chart-panel">
              <div class="chart-panel__visual">
                <div ref="riskPieRef" class="pie-chart" />
              </div>
              <ul class="rank-list">
                <li
                  v-for="(item, index) in riskRanks"
                  :key="item.name"
                  :class="{ 'is-top': index < 3 }"
                >
                  <span class="dot" :style="{ backgroundColor: item.color }" />
                  <span class="name">{{ item.name }}</span>
                  <span class="value">{{ formatPercent(item.value, 2) }}</span>
                </li>
              </ul>
            </div>

            <div class="section-hint">
              <h3>
                <TipIcon />
                风险分类提示
              </h3>
              <p class="highlight-lines">
                <span class="hl"
                  >审计监察部将一级风险分为16类，其中有14类一级风险在2025年有触发，占比87.5%，</span
                >
                <span class="hl"
                  >其中渠道、供应链、人力资源等领域出现的比例偏高，需要各对口的部门重视与关注。</span
                >
              </p>
            </div>
          </section>

          <section class="data-section data-section--rect">
            <div class="section-head">
              <span class="grid-icon" aria-hidden="true">
                <i class="sq sq-yellow" />
                <i class="sq sq-green" />
                <i class="sq sq-blue" />
                <i class="sq sq-red" />
              </span>
              <h2>整改分类情况</h2>
              <span class="section-badge section-badge--gold">{{ rectRanks.length }} 类</span>
            </div>

            <div class="chart-panel chart-panel--rect">
              <div class="chart-panel__visual">
                <div ref="rectPieRef" class="pie-chart pie-chart--rect" />
              </div>
              <div class="chart-panel__side">
                <ul class="rank-list rank-list--rect">
                  <li
                    v-for="(item, index) in rectRanks"
                    :key="item.name"
                    :class="{ 'is-top': index < 2 }"
                  >
                    <span class="dot" :style="{ backgroundColor: item.color }" />
                    <span class="name">{{ item.name }}</span>
                    <span class="value">{{ formatPercent(item.value, 0) }}</span>
                  </li>
                </ul>
                <p class="rect-note">其他整改主要包含：文化宣导、监督检查等措施</p>
              </div>
            </div>

            <div class="section-hint">
              <h3>
                <TipIcon />
                风险整改提示
              </h3>
              <p class="highlight-lines">
                <span class="hl"
                  >审计监察部披露的风险整改类型有5类，分别是流程整改、系统整改、挽损整改、其他整改、追责通报。</span
                >
                <span class="hl"
                  >整改方面，我们会优先关注中高风险，尽力与业务达成共识，朝着共同目标去推进，让业务变得健康，进而助力业务成功。</span
                >
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { useNarrowViewport } from '@/composables/useNarrowViewport'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { echarts, type ECharts } from '@/utils/echartsSetup'
import SlideShell from '@/components/common/SlideShell.vue'
import TipIcon from '@/components/common/TipIcon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const { isNarrow } = useNarrowViewport()

const store = useBillStore()
const rootRef = ref<HTMLElement | null>(null)
const billPaperRef = ref<HTMLElement | null>(null)
const riskPieRef = ref<HTMLElement | null>(null)
const rectPieRef = ref<HTMLElement | null>(null)

let riskChart: ECharts | null = null
let rectChart: ECharts | null = null
let rectObserver: IntersectionObserver | null = null
let resizeObservers: ResizeObserver[] = []

const riskData = computed(() => store.billData?.details_data.risk_categories ?? [])
const rectData = computed(
  () => store.billData?.details_data.rectification_categories ?? []
)
const riskRanks = computed(() => [...riskData.value].sort((a, b) => b.value - a.value))
const rectRanks = computed(() => [...rectData.value].sort((a, b) => b.value - a.value))

function formatPercent(value: number, digits: number) {
  const text =
    digits === 0
      ? Math.round(value).toString()
      : value.toFixed(digits).replace(/\.?0+$/, '')
  return `${text}%`
}

type PieBuildOpts = {
  compact: boolean
  /** 扇区上显示数值标签（整改分类条目少，适合全开） */
  showSliceLabels: boolean
  /** 风险分类条目多：仅对占比更高的扇区打标签 */
  labelMinPercent?: number
  centerLabel?: string
  centerSub?: string
}

function buildPieOption(
  data: { name: string; value: number; color?: string }[],
  opts: PieBuildOpts
) {
  const { compact, showSliceLabels, labelMinPercent = 0, centerLabel, centerSub } = opts
  // 参考 shadcn RoundedPieChart：innerRadius / cornerRadius / paddingAngle
  const inner = compact ? '34%' : '38%'
  const outer = compact ? '82%' : '88%'
  const padAngle = compact ? 3 : 4
  const borderRadius = compact ? 6 : 8

  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: { name: string; percent: number; value: number }) =>
        `<div style="font-weight:700;margin-bottom:2px">${params.name}</div>${params.percent.toFixed(1)}%`,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(32, 178, 170, 0.28)',
      borderWidth: 1,
      extraCssText:
        'border-radius:10px;box-shadow:0 8px 24px rgba(4,31,36,0.16);padding:8px 12px;',
      textStyle: { color: '#052e2c', fontSize: 12, fontWeight: 600 },
    },
    graphic: centerLabel
      ? [
          {
            type: 'text' as const,
            left: 'center',
            top: '42%',
            style: {
              text: centerLabel,
              fill: '#052e2c',
              fontSize: compact ? 16 : 18,
              fontWeight: 800,
              align: 'center' as const,
              verticalAlign: 'middle' as const,
            },
          },
          {
            type: 'text' as const,
            left: 'center',
            top: '54%',
            style: {
              text: centerSub ?? '',
              fill: 'rgba(5, 46, 44, 0.58)',
              fontSize: compact ? 10 : 11,
              fontWeight: 600,
              align: 'center' as const,
              verticalAlign: 'middle' as const,
            },
          },
        ]
      : undefined,
    series: [
      {
        type: 'pie' as const,
        radius: [inner, outer],
        center: ['50%', '50%'],
        padAngle,
        minAngle: 2,
        itemStyle: {
          borderRadius,
          borderColor: 'transparent',
          borderWidth: 0,
          shadowBlur: 6,
          shadowColor: 'rgba(4, 31, 36, 0.12)',
        },
        label: showSliceLabels
          ? {
              show: true,
              position: 'inside' as const,
              formatter: (params: { percent: number }) =>
                params.percent >= labelMinPercent
                  ? `${Math.round(params.percent)}`
                  : '',
              color: '#fff',
              fontSize: compact ? 10 : 11,
              fontWeight: 700,
              textBorderColor: 'transparent',
              textShadowColor: 'rgba(4, 31, 36, 0.35)',
              textShadowBlur: 3,
            }
          : { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'rgba(32, 178, 170, 0.35)',
          },
          label: {
            show: showSliceLabels,
            fontSize: compact ? 11 : 12,
            fontWeight: 800,
          },
        },
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color ?? '#20B2AA' },
        })),
        animationType: 'scale' as const,
        animationEasing: 'cubicOut' as const,
        animationDelay: (idx: number) => idx * 28,
      },
    ],
  }
}

function renderPie(
  el: HTMLElement | null,
  data: { name: string; value: number; color?: string }[],
  chart: ECharts | null,
  kind: 'risk' | 'rect'
): ECharts | null {
  if (!el || !data.length) return chart
  const instance = chart ?? echarts.init(el)
  const compact = isNarrow.value
  const option =
    kind === 'risk'
      ? buildPieOption(data, {
          compact,
          showSliceLabels: true,
          labelMinPercent: compact ? 8 : 6,
          centerLabel: String(data.length),
          centerSub: '类风险',
        })
      : buildPieOption(data, {
          compact,
          showSliceLabels: true,
          labelMinPercent: 0,
          centerLabel: String(data.length),
          centerSub: '类整改',
        })
  instance.setOption(option, { notMerge: true })
  instance.resize()
  return instance
}

const disposeCharts = () => {
  riskChart?.dispose()
  rectChart?.dispose()
  riskChart = null
  rectChart = null
}

const clearObservers = () => {
  rectObserver?.disconnect()
  rectObserver = null
  resizeObservers.forEach((ro) => ro.disconnect())
  resizeObservers = []
}

const observeResize = (el: HTMLElement | null, getChart: () => ECharts | null) => {
  if (!el || typeof ResizeObserver === 'undefined') return
  const ro = new ResizeObserver(() => getChart()?.resize())
  ro.observe(el)
  resizeObservers.push(ro)
}

const initRectChart = () => {
  if (!rectPieRef.value || !rectData.value.length) return
  rectChart = renderPie(rectPieRef.value, rectData.value, rectChart, 'rect')
}

const mountCharts = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resizeObservers.forEach((ro) => ro.disconnect())
      resizeObservers = []

      if (riskPieRef.value) {
        riskChart = renderPie(riskPieRef.value, riskData.value, riskChart, 'risk')
        observeResize(riskPieRef.value, () => riskChart)
      }
      initRectChart()
      if (rectPieRef.value) {
        observeResize(rectPieRef.value, () => rectChart)
      }
    })
  })
}

const setupRectObserver = () => {
  if (!rectPieRef.value || typeof IntersectionObserver === 'undefined') return
  rectObserver?.disconnect()
  rectObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        initRectChart()
        rectChart?.resize()
      }
    },
    { root: billPaperRef.value, threshold: 0.2 }
  )
  rectObserver.observe(rectPieRef.value)
}

const handlePaperScroll = () => {
  rectChart?.resize()
}

const handleResize = () => {
  riskChart?.resize()
  rectChart?.resize()
}

watch(
  isActive,
  (active) => {
    if (active) {
      void mountCharts()
      setupRectObserver()
      billPaperRef.value?.addEventListener('scroll', handlePaperScroll, { passive: true })
      window.addEventListener('resize', handleResize)
    } else {
      billPaperRef.value?.removeEventListener('scroll', handlePaperScroll)
      window.removeEventListener('resize', handleResize)
      clearObservers()
      disposeCharts()
    }
  },
  { flush: 'post' }
)

watch([rectData, isNarrow], () => {
  if (isActive.value) {
    void mountCharts()
  }
})

onUnmounted(() => {
  billPaperRef.value?.removeEventListener('scroll', handlePaperScroll)
  window.removeEventListener('resize', handleResize)
  clearObservers()
  disposeCharts()
})

useIsActiveAnimation(
  isActive,
  (tl) => {
    const scope = rootRef.value
    if (!scope) return
    tl.from(scope.querySelector('.page-headline'), { y: -16, opacity: 0, duration: 0.5 })
    tl.from(scope.querySelector('.bill-slot'), { scaleX: 0.6, opacity: 0, duration: 0.45 }, '-=0.15')
    tl.from(
      scope.querySelector('.bill-paper'),
      { y: 28, opacity: 0, duration: 0.65, ease: 'power2.out' },
      '-=0.2'
    )
  },
  {
    onEnter: () => {
      setTimeout(() => {
        initRectChart()
        riskChart?.resize()
        rectChart?.resize()
      }, 720)
    },
  }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-risk-pie {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: var(--space-1);
}

.page-headline {
  margin: 0;
  text-align: center;
  font-size: clamp(1.1rem, 4.4vw, 1.35rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.8px;
  line-height: 1.3;
  flex-shrink: 0;
  text-shadow:
    0 2px 10px rgba(2, 18, 38, 0.7),
    0 0 16px rgba(34, 228, 224, 0.35);
}

.bill-frame {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--space-2);
}

.bill-slot {
  width: min(92%, 360px);
  height: 24px;
  background: linear-gradient(180deg, #32e8e2 0%, $bill-mint 35%, $bill-brand-deep 100%);
  border-radius: 14px 14px 4px 4px;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.35),
    0 4px 14px rgba(2, 18, 38, 0.35);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.bill-paper {
  width: min(96%, 380px);
  flex: 1;
  min-height: 0;
  margin-top: -4px;
  @include bill-glass-panel;
  border-radius: 0 0 20px 20px;
  padding: 16px 14px 72px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
  z-index: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.data-section {
  flex-shrink: 0;

  &--rect {
    padding-top: var(--space-3);
    border-top: 1px dashed rgba(10, 77, 100, 0.2);
  }
}

.section-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);

  h2 {
    margin: 0;
    font-size: clamp(1.02rem, 3.8vw, 1.15rem);
    font-weight: 800;
    color: $bill-brand-dark;
    letter-spacing: 0.4px;
  }
}

.section-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: var(--text-2xs);
  font-weight: 800;
  color: $bill-brand-deep;
  background: rgba(0, 196, 199, 0.16);
  border: 1px solid rgba(0, 196, 199, 0.3);

  &--gold {
    color: #8c5d00;
    background: rgba(255, 215, 0, 0.22);
    border-color: rgba(255, 215, 0, 0.45);
  }
}

.grid-icon {
  display: grid;
  grid-template-columns: repeat(2, 8px);
  grid-template-rows: repeat(2, 8px);
  gap: 2.5px;
  flex-shrink: 0;

  .sq {
    display: block;
    border-radius: 2px;
  }

  .sq-yellow { background: #ffb703; }
  .sq-green { background: #2a9d8f; }
  .sq-blue { background: #219ebc; }
  .sq-red { background: #e76f51; }
}

.chart-panel {
  display: grid;
  grid-template-columns: minmax(148px, 44%) 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: 12px 10px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 4px 16px rgba(2, 18, 38, 0.05);

  &--rect {
    align-items: stretch;
  }
}

.chart-panel__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.chart-panel__side {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
}

.pie-chart {
  width: 100%;
  aspect-ratio: 1;
  max-width: 184px;
  min-height: 144px;
  margin: 0 auto;
  position: relative;

  &--rect {
    max-width: 164px;
    min-height: 132px;
  }

  :deep(canvas) {
    display: block;
  }
}

.rank-list {
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0 2px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 176px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  li {
    display: grid;
    grid-template-columns: 8px minmax(0, 1fr) auto;
    align-items: center;
    column-gap: var(--space-2);
    min-height: 20px;
    color: #072a3b;
    font-weight: 600;
    font-size: var(--text-xs);
    line-height: 1.3;
  }

  .is-top {
    color: $bill-brand-dark;
    font-weight: 800;

    .value {
      color: #054863;
      font-weight: 800;
    }
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.9);
  }

  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.1px;
  }

  .value {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    font-weight: 700;
    color: #0b4d66;
    white-space: nowrap;
  }
}

.rect-note {
  margin: 0;
  padding: var(--space-1) var(--space-2);
  border-radius: 8px;
  background: rgba(0, 196, 199, 0.14);
  font-size: var(--text-2xs);
  color: #064057;
  font-weight: 700;
  line-height: 1.4;
}

.section-hint {
  margin-top: var(--space-2);
  padding: var(--space-3);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(10, 77, 100, 0.1);

  h3 {
    font-size: var(--text-sm);
    color: $bill-brand-dark;
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin: 0 0 var(--space-2);
    font-weight: 800;

    :deep(.tip-icon) {
      width: 1.1em;
      height: 1.1em;
      color: $bill-alert-red;
    }
  }

  .highlight-lines {
    margin: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    text-align: justify;
    font-size: var(--text-xs);
    line-height: 1.75;
    color: #042533;
    font-weight: 600;
  }

  .hl {
    display: inline;
    background: linear-gradient(transparent 58%, rgba(0, 196, 199, 0.28) 58%);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.slide-risk-pie--compact {
  .page-headline {
    font-size: 0.98rem;
    line-height: 1.25;
  }

  .bill-frame {
    margin-top: var(--space-1);
  }

  .bill-slot {
    height: 20px;
  }

  .bill-paper {
    padding: 10px 8px 16px;
    gap: var(--space-2);
  }

  .section-head {
    margin-bottom: var(--space-1);

    h2 {
      font-size: 0.92rem;
    }
  }

  .chart-panel {
    grid-template-columns: minmax(108px, 38%) 1fr;
    gap: var(--space-2);
    padding: 8px 6px;
    border-radius: 12px;
  }

  .pie-chart {
    max-width: 124px;
    min-height: 110px;

    &--rect {
      max-width: 112px;
      min-height: 100px;
    }
  }

  .rank-list {
    max-height: 124px;
    gap: 2px;

    li {
      font-size: 0.64rem;
      min-height: 16px;
    }

    .dot {
      width: 6px;
      height: 6px;
    }
  }

  .rect-note {
    font-size: 0.58rem;
    padding: 2px 4px;
  }

  .section-hint {
    margin-top: var(--space-1);
    padding: var(--space-2);

    h3 {
      font-size: 0.8rem;
      margin-bottom: 2px;
    }

    .highlight-lines {
      font-size: 0.65rem;
      line-height: 1.55;
    }
  }
}

@media (max-width: 380px) {
  .page-headline {
    font-size: 1rem;
  }

  .chart-panel {
    grid-template-columns: minmax(96px, 35%) 1fr;
  }

  .rank-list li {
    font-size: 0.62rem;
  }
}

@media (max-height: 700px) {
  .bill-frame {
    margin-top: 4px;
  }

  .section-hint .highlight-lines {
    font-size: 0.68rem;
    line-height: 1.5;
  }
}
</style>
