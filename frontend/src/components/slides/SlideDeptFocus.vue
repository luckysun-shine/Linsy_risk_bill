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
  padding: 18px 14px max(72px, env(safe-area-inset-bottom));
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
  padding: 18px 18px 20px;
  overflow: hidden;
  @include bill-glass-panel;

  &__deco {
    position: absolute;
    inset: 18% 0 8%;
    opacity: 0.7;
    pointer-events: none;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__mascot {
    position: absolute;
    top: 6px;
    right: 2px;
    width: clamp(78px, 26vw, 104px);
    height: auto;
    object-fit: contain;
    pointer-events: none;
    filter: drop-shadow(0 8px 14px rgba(4, 31, 36, 0.22));
    z-index: 2;
  }
}

.eyebrow {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: calc(100% - 96px);
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.7);
}

.dept-name {
  position: relative;
  z-index: 1;
  margin: 6px 0 16px;
  max-width: calc(100% - 96px);
  font-size: clamp(1.55rem, 7vw, 2rem);
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
  gap: 10px;

  li {
    font-size: clamp(0.78rem, 2.8vw, 0.88rem);
    font-weight: 650;
    line-height: 1.55;
    color: rgba(5, 46, 44, 0.88);
  }

  .accent {
    color: #12b886;
    font-size: 1.35em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.2px;
  }
}

.binder {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: -10px 0 -8px;
  pointer-events: none;

  &__ring {
    width: 18px;
    height: 28px;
    border: 3.5px solid #0a5c58;
    border-radius: 999px;
    background: transparent;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.25),
      0 2px 4px rgba(4, 31, 36, 0.18);
  }
}

.tip-card {
  position: relative;
  z-index: 2;
  margin-top: 4px;
  padding: 16px 14px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1.5px solid rgba(20, 143, 136, 0.28);
  box-shadow: 0 10px 24px rgba(4, 31, 36, 0.12);

  &__head {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    padding: 5px 12px 5px 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, #0a5c58, #148f88);
    box-shadow: 0 4px 10px rgba(10, 92, 88, 0.28);

    h3 {
      margin: 0;
      font-size: 0.82rem;
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
    color: #ff3b6d;
    background: #fff;
    line-height: 1;
  }

  &__body {
    margin: 0;
    font-size: clamp(0.72rem, 2.5vw, 0.8rem);
    line-height: 1.7;
    font-weight: 600;
    color: rgba(5, 46, 44, 0.86);
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
    font-size: 1.4rem;
  }

  .metric-list {
    gap: 7px;

    li {
      font-size: 0.74rem;
    }
  }

  .stats-card__mascot {
    width: 72px;
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
