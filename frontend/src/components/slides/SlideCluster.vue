<template>
  <SlideShell
    character="detail2"
    char-position="bottom-right"
    overlay="light"
    sky-variant="cluster"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-cluster">
      <PageRibbon class="ribbon">重大风险</PageRibbon>

      <div class="glass-card panel" data-bill-scroll>
        <h2 class="headline">
          <span
            v-for="(part, index) in report.headline"
            :key="`h-${index}`"
            :class="{ strong: part.strong }"
          >{{ part.text }}</span>
        </h2>

        <p
          v-for="(paragraph, pIndex) in report.paragraphs"
          :key="`p-${pIndex}`"
          class="body-text"
        >
          <span
            v-for="(part, partIndex) in paragraph"
            :key="`p-${pIndex}-${partIndex}`"
            :class="{ accent: part.accent }"
          >{{ part.text }}</span>
        </p>

        <div class="section-hint praise-note">
          <h3>
            <span class="praise-icon" aria-hidden="true">👍</span>
            {{ report.praise.title }}
          </h3>
          <p class="highlight-lines">
            <span
              v-for="(part, index) in report.praise.body"
              :key="index"
              :class="{ accent: part.accent }"
            >{{ part.text }}</span>
          </p>
        </div>

        <p
          v-for="(line, index) in report.closing"
          :key="`c-${index}`"
          class="closing"
        >
          {{ line }}
        </p>
      </div>
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { animateSlideEntrance } from '@/composables/useSlideEntrance'
import { mockRiskReport } from '@/data/riskReportData'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const rootRef = ref<HTMLElement | null>(null)
const store = useBillStore()

const report = computed(
  () => store.billData?.details_data.risk_report ?? mockRiskReport
)

useIsActiveAnimation(isActive, (tl) => {
  animateSlideEntrance(tl, rootRef.value, [
    '.ribbon',
    '.panel',
    '.praise-note',
    '.closing',
  ])
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-cluster {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6px;
  box-sizing: border-box;
}

.ribbon {
  flex-shrink: 0;
}

.panel {
  width: 100%;
  max-width: 400px;
  flex: 1;
  min-height: 0;
  margin-top: 14px;
  margin-bottom: max(72px, env(safe-area-inset-bottom));
  padding: 16px 14px 18px;
  text-align: left;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  @include bill-glass-panel;
}

.headline {
  margin: 0 0 12px;
  font-size: clamp(0.92rem, 3.2vw, 1.05rem);
  font-weight: 700;
  line-height: 1.45;
  color: rgba(5, 46, 44, 0.88);

  .strong {
    font-weight: 900;
    color: $bill-brand-dark;
  }
}

.body-text {
  margin: 0 0 10px;
  font-size: clamp(0.72rem, 2.4vw, 0.8rem);
  line-height: 1.7;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.86);

  .accent {
    color: $bill-brand-deep;
    font-size: 1.22em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.2px;
    background: linear-gradient(transparent 55%, rgba(255, 215, 0, 0.5) 55%);
    padding: 0 2px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.section-hint {
  margin: 12px 0;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(10, 77, 100, 0.08);

  h3 {
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.92rem;
    font-weight: 800;
    color: $bill-brand-dark;
  }

  .praise-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .highlight-lines {
    margin: 0;
    font-size: clamp(0.7rem, 2.3vw, 0.78rem);
    line-height: 1.7;
    font-weight: 600;
    color: rgba(5, 46, 44, 0.88);
  }

  .accent {
    display: inline;
    color: $bill-brand-deep;
    font-size: 1.22em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(transparent 55%, rgba(255, 215, 0, 0.5) 55%);
    padding: 0 2px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.closing {
  margin: 0 0 8px;
  font-size: clamp(0.7rem, 2.3vw, 0.76rem);
  line-height: 1.65;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.78);

  &:last-child {
    margin-bottom: 0;
  }
}

@media (max-height: 700px) {
  .panel {
    margin-top: 10px;
    padding: 12px;
  }

  .headline {
    font-size: 0.88rem;
  }

  .body-text,
  .closing {
    font-size: 0.68rem;
    line-height: 1.55;
  }

  .section-hint {
    margin: 8px 0;
    padding: 8px;

    h3 {
      font-size: 0.82rem;
    }

    .highlight-lines {
      font-size: 0.66rem;
    }
  }
}
</style>
