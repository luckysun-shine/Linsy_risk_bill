<template>
  <SlideShell
    character="none"
    overlay="light"
    sky-variant="milestone"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-dept-focus">
      <div class="stack">
        <section class="stats-card glass-card">
          <div class="stats-card__deco" aria-hidden="true">
            <svg viewBox="0 0 320 120" preserveAspectRatio="none">
              <polyline
                points="0,88 40,78 80,92 120,58 160,70 200,42 240,54 280,28 320,36"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                points="0,98 50,90 100,102 150,76 200,84 250,62 320,70"
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <img :src="charSrc" class="stats-card__mascot" alt="" />

          <p class="eyebrow">{{ report.eyebrow }}</p>
          <h2 class="dept-name">{{ report.department }}</h2>

          <ul class="metric-list">
            <li v-for="(line, index) in report.metrics" :key="index">
              <span
                v-for="(part, partIndex) in line"
                :key="`${index}-${partIndex}`"
                :class="{ accent: part.accent }"
              >{{ part.text }}</span>
            </li>
          </ul>
        </section>

        <div class="binder" aria-hidden="true">
          <span v-for="n in 4" :key="n" class="binder__ring" />
        </div>

        <aside class="tip-card">
          <header class="tip-card__head">
            <span class="tip-card__icon" aria-hidden="true">i</span>
            <h3>{{ report.tipTitle ?? '风控提示' }}</h3>
          </header>
          <p class="tip-card__body">{{ report.tip }}</p>
        </aside>
      </div>
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DeptFocusPageConfig, SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { animateSlideEntrance } from '@/composables/useSlideEntrance'
import { mockDeptFocusReports } from '@/data/deptFocusData'
import { IP_ASSETS } from '@/constants/ipAssets'
import SlideShell from '@/components/common/SlideShell.vue'

const props = defineProps<
  SlideProps & {
    pageConfig: DeptFocusPageConfig
  }
>()

const { isActive } = useBillSlide(props.slideIndex)
const rootRef = ref<HTMLElement | null>(null)
const store = useBillStore()

const reports = computed(
  () => store.billData?.details_data.dept_focus_reports ?? mockDeptFocusReports
)

const report = computed(() => {
  const id = props.pageConfig.focusId
  return reports.value.find((item) => item.id === id) ?? reports.value[0]
})

const charSrc = computed(() => {
  const map = {
    audit: IP_ASSETS.detail2,
    supervision: IP_ASSETS.home,
    control: IP_ASSETS.detail1,
  } as const
  return map[report.value.id as keyof typeof map] ?? IP_ASSETS.detail2
})

useIsActiveAnimation(isActive, (tl) => {
  animateSlideEntrance(tl, rootRef.value, ['.stats-card', '.binder', '.tip-card'])
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-dept-focus {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-3) max(72px, env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.stack {
  position: relative;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.stats-card {
  position: relative;
  z-index: 2;
  padding: 20px 18px 22px;
  overflow: hidden;
  @include bill-glass-panel;

  &__deco {
    position: absolute;
    inset: 18% 0 8%;
    opacity: 0.6;
    pointer-events: none;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__mascot {
    position: absolute;
    top: 6px;
    right: 4px;
    width: clamp(76px, 24vw, 100px);
    height: auto;
    object-fit: contain;
    pointer-events: none;
    filter: drop-shadow(0 8px 14px rgba(2, 18, 38, 0.25));
    z-index: 2;
  }
}

.eyebrow {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: calc(100% - 90px);
  font-size: var(--text-xs);
  font-weight: 700;
  color: #064057;
  letter-spacing: 0.5px;
}

.dept-name {
  position: relative;
  z-index: 1;
  margin: 6px 0 16px;
  max-width: calc(100% - 90px);
  font-size: clamp(1.45rem, 6.8vw, 1.95rem);
  font-weight: 900;
  line-height: 1.15;
  color: $bill-brand-dark;
  letter-spacing: 0.5px;
}

.metric-list {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  li {
    font-size: clamp(0.78rem, 2.7vw, 0.88rem);
    font-weight: 650;
    line-height: 1.6;
    color: #042533;
  }

  .accent {
    color: #0a8f7b;
    font-size: 1.35em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    letter-spacing: 0.2px;
  }
}

.binder {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: -10px 0 -8px;
  pointer-events: none;

  &__ring {
    width: 16px;
    height: 26px;
    border: 3.5px solid #084c48;
    border-radius: 999px;
    background: linear-gradient(180deg, #1fa39b 0%, #063c39 100%);
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.4),
      0 3px 6px rgba(2, 18, 38, 0.25);
  }
}

.tip-card {
  position: relative;
  z-index: 2;
  margin-top: 4px;
  padding: 16px 16px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(0, 196, 199, 0.25);
  box-shadow: 0 10px 24px rgba(2, 18, 38, 0.12);

  &__head {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0 0 10px;
    padding: 4px 12px 4px 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, #095973, #1a9e96);
    box-shadow: 0 3px 8px rgba(9, 89, 115, 0.25);

    h3 {
      margin: 0;
      font-size: var(--text-xs);
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.5px;
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: 900;
    font-style: italic;
    color: $bill-alert-red;
    background: #fff;
    line-height: 1;
  }

  &__body {
    margin: 0;
    font-size: clamp(0.74rem, 2.5vw, 0.82rem);
    line-height: 1.75;
    font-weight: 600;
    color: #042533;
  }
}

@media (max-height: 700px) {
  .slide-dept-focus {
    padding-top: 10px;
    justify-content: flex-start;
  }

  .stats-card {
    padding: 14px 14px 16px;
  }

  .dept-name {
    margin-bottom: 10px;
    font-size: 1.35rem;
  }

  .metric-list {
    gap: 6px;

    li {
      font-size: 0.74rem;
    }
  }

  .stats-card__mascot {
    width: 70px;
  }

  .tip-card {
    padding: 12px;

    &__body {
      font-size: 0.7rem;
      line-height: 1.55;
    }
  }
}
</style>
