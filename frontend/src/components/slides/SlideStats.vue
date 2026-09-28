<template>
  <SlideShell
    character="detail1"
    char-position="bottom-right"
    overlay="light"
    sky-variant="stats"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-stats">
      <PageRibbon class="ribbon">合规数读</PageRibbon>

      <div class="glass-card panel" data-bill-scroll>
        <p class="intro">{{ education.intro }}</p>

        <ul class="edu-list">
          <li v-for="(item, index) in education.items" :key="item.title" class="edu-item">
            <div class="edu-item__head">
              <span class="edu-item__index">{{ index + 1 }}</span>
              <h3 class="edu-item__title">{{ item.title }}</h3>
            </div>
            <p
              v-for="(paragraph, pIndex) in item.paragraphs"
              :key="`${item.title}-${pIndex}`"
              class="edu-item__text"
            >
              <span
                v-for="(part, partIndex) in paragraph"
                :key="`${item.title}-${pIndex}-${partIndex}`"
                :class="{ accent: part.accent }"
              >{{ part.text }}</span>
            </p>
          </li>
        </ul>
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
import { mockComplianceEducation } from '@/data/complianceEducationData'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const rootRef = ref<HTMLElement | null>(null)
const store = useBillStore()

const education = computed(
  () => store.billData?.details_data.compliance_education ?? mockComplianceEducation
)

useIsActiveAnimation(isActive, (tl) => {
  animateSlideEntrance(tl, rootRef.value, ['.ribbon', '.panel', '.edu-item'])
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-stats {
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

.intro {
  margin: 0 0 var(--space-3);
  font-size: clamp(0.82rem, 2.8vw, 0.92rem);
  line-height: 1.7;
  font-weight: 600;
  color: #053447;
}

.edu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.edu-item {
  padding: 14px 14px 12px;
  border-radius: 16px;
  @include bill-glass-inset;
}

.edu-item__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.edu-item__index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: 900;
  color: #fff;
  background: linear-gradient(145deg, $bill-aurora, $bill-mint);
  box-shadow: 0 2px 8px rgba(0, 196, 199, 0.4);
}

.edu-item__title {
  margin: 0;
  font-size: clamp(0.98rem, 3.6vw, 1.12rem);
  font-weight: 800;
  color: $bill-brand-dark;
  letter-spacing: 0.3px;
}

.edu-item__text {
  margin: 0 0 var(--space-2);
  font-size: clamp(0.74rem, 2.5vw, 0.82rem);
  line-height: 1.75;
  font-weight: 600;
  color: #042533;

  &:last-child {
    margin-bottom: 0;
  }

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

@media (max-height: 700px) {
  .panel {
    margin-top: 8px;
    padding: 12px 12px 14px;
  }

  .edu-list {
    gap: 8px;
  }

  .edu-item {
    padding: 10px;
  }

  .intro,
  .edu-item__text {
    font-size: 0.72rem;
    line-height: 1.55;
  }

  .edu-item__title {
    font-size: 0.92rem;
  }
}
</style>
