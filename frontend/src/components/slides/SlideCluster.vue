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
  padding-top: var(--space-1);
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
  margin-top: var(--space-3);
  margin-bottom: max(72px, env(safe-area-inset-bottom));
  padding: 18px 16px;
  text-align: left;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  @include bill-glass-panel;
}

.headline {
  margin: 0 0 var(--space-3);
  font-size: clamp(0.95rem, 3.4vw, 1.08rem);
  font-weight: 700;
  line-height: 1.5;
  color: #064057;

  .strong {
    font-weight: 900;
    color: $bill-brand-dark;
  }
}

.body-text {
  margin: 0 0 var(--space-2);
  font-size: clamp(0.74rem, 2.5vw, 0.82rem);
  line-height: 1.75;
  font-weight: 600;
  color: #042533;

  .accent {
    color: #0b4d66;
    font-size: 1.25em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    letter-spacing: 0.3px;
    background: linear-gradient(transparent 55%, rgba(255, 215, 0, 0.45) 55%);
    padding: 0 3px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.section-hint {
  margin: var(--space-3) 0;
  padding: var(--space-3);
  border-radius: 14px;
  @include bill-glass-inset;

  h3 {
    margin: 0 0 var(--space-2);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: 800;
    color: $bill-brand-dark;
  }

  .praise-icon {
    font-size: 1.1rem;
    line-height: 1;
  }

  .highlight-lines {
    margin: 0;
    font-size: clamp(0.72rem, 2.4vw, 0.8rem);
    line-height: 1.75;
    font-weight: 600;
    color: #042533;
  }

  .accent {
    display: inline;
    color: #0b4d66;
    font-size: 1.25em;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    background: linear-gradient(transparent 55%, rgba(255, 215, 0, 0.45) 55%);
    padding: 0 3px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }
}

.closing {
  margin: 0 0 var(--space-2);
  font-size: clamp(0.72rem, 2.4vw, 0.78rem);
  line-height: 1.7;
  font-weight: 600;
  color: #064057;

  &:last-child {
    margin-bottom: 0;
  }
}

@media (max-height: 700px) {
  .panel {
    margin-top: 8px;
    padding: 12px;
  }

  .headline {
    font-size: 0.9rem;
  }

  .body-text,
  .closing {
    font-size: 0.7rem;
    line-height: 1.55;
  }

  .section-hint {
    margin: 6px 0;
    padding: 8px;

    h3 {
      font-size: 0.82rem;
    }

    .highlight-lines {
      font-size: 0.68rem;
    }
  }
}
</style>
