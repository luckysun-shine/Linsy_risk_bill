<template>
  <SlideShell
    character="detail1"
    char-position="bottom-right"
    overlay="light"
    sky-variant="milestone"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-milestone">
      <PageRibbon class="ribbon">高风险阻击战</PageRibbon>

      <div class="glass-card panel" data-bill-scroll>
        <p class="intro">{{ report.subtitle }}</p>

        <ul class="edu-list">
          <li
            v-for="(dept, index) in report.departments"
            :key="dept.name"
            class="edu-item"
          >
            <div class="edu-item__head">
              <span class="edu-item__index">{{ index + 1 }}</span>
              <h3 class="edu-item__title">{{ dept.name }}</h3>
            </div>
            <p class="edu-item__lead">{{ dept.lead }}</p>
            <p
              v-for="(line, lineIndex) in dept.lines"
              :key="`${dept.name}-${lineIndex}`"
              class="edu-item__text"
            >
              <span
                v-for="(part, partIndex) in line"
                :key="`${dept.name}-${lineIndex}-${partIndex}`"
                :class="{ accent: part.accent }"
              >{{ part.text }}</span>
            </p>
          </li>
        </ul>

        <div v-if="report.tip" class="section-hint">
          <h3>
            <TipIcon />
            {{ report.tip.title }}
          </h3>
          <p class="highlight-lines">
            <span
              v-for="(part, index) in report.tip.body"
              :key="index"
              :class="{ accent: part.accent }"
            >{{ part.text }}</span>
          </p>
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
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { animateSlideEntrance } from '@/composables/useSlideEntrance'
import { mockDeptBattleReport } from '@/data/deptBattleReportData'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'
import TipIcon from '@/components/common/TipIcon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const rootRef = ref<HTMLElement | null>(null)
const store = useBillStore()

const report = computed(
  () => store.billData?.details_data.dept_battle_report ?? mockDeptBattleReport
)

useIsActiveAnimation(isActive, (tl) => {
  animateSlideEntrance(tl, rootRef.value, ['.ribbon', '.panel', '.edu-item', '.section-hint'])
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-milestone {
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

.intro {
  margin: 0 0 14px;
  font-size: clamp(0.78rem, 2.6vw, 0.88rem);
  line-height: 1.65;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.88);
}

.edu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edu-item {
  padding: 12px 12px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.edu-item__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.edu-item__index {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(145deg, $bill-aurora, $bill-mint);
  box-shadow: 0 2px 8px rgba(32, 178, 170, 0.35);
}

.edu-item__title {
  margin: 0;
  font-size: clamp(0.95rem, 3.4vw, 1.08rem);
  font-weight: 800;
  color: $bill-brand-dark;
  letter-spacing: 0.3px;
}

.edu-item__lead {
  margin: 0 0 8px;
  font-size: clamp(0.72rem, 2.4vw, 0.8rem);
  line-height: 1.55;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.7);
}

.edu-item__text {
  margin: 0 0 6px;
  font-size: clamp(0.72rem, 2.4vw, 0.8rem);
  line-height: 1.7;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.86);

  &:last-child {
    margin-bottom: 0;
  }

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
  margin-top: 14px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(10, 77, 100, 0.08);

  h3 {
    font-size: 0.92rem;
    color: $bill-brand-dark;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 6px;
    font-weight: 800;

    :deep(.tip-icon) {
      width: 1.05em;
      height: 1.05em;
      color: #ff3b6d;
    }
  }

  .highlight-lines {
    margin: 0;
    width: 100%;
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

@media (max-height: 700px) {
  .panel {
    margin-top: 10px;
    padding: 12px 12px 14px;
  }

  .edu-list {
    gap: 8px;
  }

  .edu-item {
    padding: 10px;
  }

  .intro,
  .edu-item__lead,
  .edu-item__text {
    font-size: 0.7rem;
    line-height: 1.55;
  }

  .edu-item__title {
    font-size: 0.9rem;
  }

  .section-hint {
    margin-top: 10px;
    padding: 8px;

    h3 {
      font-size: 0.82rem;
    }

    .highlight-lines {
      font-size: 0.66rem;
      line-height: 1.55;
    }
  }
}
</style>
