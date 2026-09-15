<template>
  <SlideShell
    :character="isNarrow ? 'none' : 'detail1'"
    char-position="bottom-right"
    overlay="none"
    sky-variant="risk_rectification"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-risk-rect" :class="{ 'slide-risk-rect--compact': isNarrow }">
      <div class="bill-frame">
        <div class="bill-slot" aria-hidden="true" />
        <div ref="billPaperRef" class="bill-paper" data-bill-scroll>
          <header class="section-head">
            <span class="monitor-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.6" />
                <path d="M8 20h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M12 17v3" stroke="currentColor" stroke-width="1.6" />
                <path d="M6 11l3-3 3 2 4-4 2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <h1>风险整改概况</h1>
          </header>

          <RectificationOverviewBlock
            ref="yearBlockRef"
            :section="overview.year_section"
            :active="isActive"
            :compact="isNarrow"
            :chart-height="chartBlockHeight"
          />

          <RectificationOverviewBlock
            ref="historyBlockRef"
            :section="overview.history_section"
            :active="isActive"
            :compact="isNarrow"
            :chart-height="chartBlockHeight"
          />

          <p class="avg-note">
            <span class="note-dot" />
            {{ overview.avg_rate_note }}
          </p>

          <section class="section-hint">
            <h3>
              <TipIcon />
              风险整改提示
            </h3>
            <p class="highlight-lines">
              <span class="hl">{{ alertParagraph1 }}</span>
              <span class="hl">{{ alertParagraph2 }}</span>
            </p>
            <p class="hint-date">Date: {{ overview.alert.report_date }}</p>
          </section>
        </div>
      </div>
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { useNarrowViewport } from '@/composables/useNarrowViewport'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { mockRectificationOverview } from '@/data/rectificationOverviewData'
import SlideShell from '@/components/common/SlideShell.vue'
import TipIcon from '@/components/common/TipIcon.vue'
import RectificationOverviewBlock from '@/components/slides/RectificationOverviewBlock.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const { isNarrow } = useNarrowViewport()

const chartBlockHeight = computed(() => (isNarrow.value ? 118 : 160))

const store = useBillStore()
const rootRef = ref<HTMLElement | null>(null)
const billPaperRef = ref<HTMLElement | null>(null)
const yearBlockRef = ref<InstanceType<typeof RectificationOverviewBlock> | null>(null)
const historyBlockRef = ref<InstanceType<typeof RectificationOverviewBlock> | null>(null)

const overview = computed(
  () => store.billData?.details_data.rectification_overview ?? mockRectificationOverview
)

const alertParagraph1 = computed(() => {
  const a = overview.value.alert
  const tops = a.top_departments.join('、')
  return `${a.year}年，审计监察部输出的应整改的风险事项${a.should_rectify_total}起，实际关闭${a.closed_total}起，整改关闭率为${a.close_rate}%，其中风险事项排TOP3的部门是${tops}，需要引起关注。`
})

const alertParagraph2 = computed(() => {
  const a = overview.value.alert
  return `在与业务伙伴共同推动风险整改关闭的过程中，为公司挽回了${a.salvage_display}的经济损失，期待更多的风控工作能做在事前和事中，与业务一起携手同行，使得工作价值最大化。`
})

useIsActiveAnimation(
  isActive,
  (tl) => {
    const scope = rootRef.value
    if (!scope) return
    tl.from(scope.querySelector('.bill-slot'), { scaleX: 0.6, opacity: 0, duration: 0.45 })
    tl.from(
      scope.querySelector('.bill-paper'),
      { y: 28, opacity: 0, duration: 0.65, ease: 'power2.out' },
      '-=0.15'
    )
    tl.from(scope.querySelector('.section-head'), { y: -12, opacity: 0, duration: 0.45 }, '-=0.35')
    tl.from(scope.querySelectorAll('.rect-block'), {
      y: 16,
      opacity: 0,
      duration: 0.5,
      stagger: 0.12,
    })
    tl.from(scope.querySelector('.section-hint'), { y: 20, opacity: 0, duration: 0.55 }, '-=0.2')
  },
  {
    onEnter: () => {
      setTimeout(() => {
        yearBlockRef.value?.renderChart()
        historyBlockRef.value?.renderChart()
      }, 680)
    },
  }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-risk-rect {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: var(--space-1);
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
  overscroll-behavior-y: contain;
}

.slide-risk-rect--compact {
  padding-top: 0;

  .bill-frame {
    margin-top: var(--space-1);
  }

  .bill-slot {
    height: 20px;
  }

  .bill-paper {
    padding: 10px 8px 56px;
    gap: var(--space-2);
  }

  .section-head {
    margin-bottom: 0;

    h1 {
      font-size: 0.95rem;
    }
  }

  .monitor-icon {
    width: 22px;
    height: 22px;
  }

  .avg-note {
    margin: 0;
    font-size: var(--text-2xs);
    line-height: 1.4;
  }

  .section-hint {
    padding: var(--space-2);
  }

  .section-hint h3 {
    margin-bottom: 4px;
    font-size: 0.82rem;
  }

  .highlight-lines {
    font-size: 0.64rem;
    line-height: 1.5;
  }

  .hint-date {
    font-size: 0.58rem;
  }
}

.section-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;

  h1 {
    margin: 0;
    font-size: clamp(1.05rem, 4vw, 1.2rem);
    font-weight: 800;
    color: $bill-brand-dark;
    letter-spacing: 0.4px;
  }
}

.monitor-icon {
  width: 26px;
  height: 26px;
  color: $bill-mint;
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(0, 196, 199, 0.45));

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.avg-note {
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: clamp(0.64rem, 2vw, 0.72rem);
  line-height: 1.5;
  color: #083c50;
  font-weight: 700;
  flex-shrink: 0;
}

.note-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $bill-alert-red;
  flex-shrink: 0;
  margin-top: 5px;
}

.section-hint {
  margin-top: var(--space-1);
  padding: var(--space-3);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(10, 77, 100, 0.1);
  flex-shrink: 0;

  h3 {
    margin: 0 0 var(--space-2);
    font-size: var(--text-sm);
    font-weight: 800;
    color: $bill-brand-dark;
    display: flex;
    align-items: center;
    gap: var(--space-1);

    :deep(.tip-icon) {
      width: 1.1em;
      height: 1.1em;
      color: $bill-alert-red;
    }
  }
}

.highlight-lines {
  margin: 0;
  width: 100%;
  font-size: clamp(0.72rem, 2.2vw, 0.8rem);
  line-height: 1.75;
  font-weight: 600;
  color: #042533;
}

.hl {
  display: inline;
  background: linear-gradient(transparent 55%, rgba(0, 196, 199, 0.28) 55%);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.hint-date {
  margin: var(--space-2) 0 0;
  text-align: right;
  font-size: var(--text-2xs);
  color: #094d66;
  font-weight: 700;
}

@media (max-width: 380px) {
  .bill-paper {
    padding: 10px 8px 56px;
  }
}

@media (max-height: 700px) {
  .bill-frame {
    margin-top: 4px;
  }

  .highlight-lines {
    font-size: 0.66rem;
    line-height: 1.55;
  }
}
</style>
