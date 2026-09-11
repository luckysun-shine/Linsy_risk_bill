<template>
  <SlideShell
    character="detail1"
    char-position="bottom-right"
    overlay="light"
    sky-variant="manager"
    :animated="isActive"
  >
    <div class="slide-manager">
      <PageRibbon class="ribbon">团队风险排名</PageRibbon>
      <p class="subtitle">{{ department }}管辖范围 · 年度合规画像</p>

      <div v-if="teamRank.length" ref="listRef" class="rank-list" data-bill-scroll>
        <div
          v-for="item in teamRank"
          :key="item.department"
          class="rank-item"
          :class="{ top: item.rank <= 3 }"
        >
          <span class="rank-num">{{ item.rank }}</span>
          <div class="rank-body">
            <span class="dept">{{ displayValue(item.department) }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :class="{ animated: isActive }"
                :style="{ '--score': item.risk_score }"
              />
            </div>
          </div>
          <span class="score">{{ item.risk_score }}</span>
        </div>
      </div>
      <p v-else class="empty">暂无团队排名数据</p>
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { displayValue } from '@/utils/displayValue'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)

const store = useBillStore()
const listRef = ref<HTMLElement | null>(null)

const teamRank = computed(() => {
  const list = store.billData?.details_data.team_rank ?? []
  return [...list].sort((a, b) => a.rank - b.rank)
})

const department = computed(() =>
  displayValue(store.billData?.user.department)
)

useIsActiveAnimation(isActive, (tl) => {
  const root = listRef.value
  if (!root) return
  const items = root.querySelectorAll('.rank-item')
  tl.from(items, {
    x: 50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-manager {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.ribbon {
  flex-shrink: 0;
}

.subtitle {
  margin-top: 12px;
  font-size: 0.88rem;
  @include bill-body-text;
  text-align: center;
  opacity: 0.88;
}

.rank-list {
  width: 100%;
  max-width: 420px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  @include bill-glass-card;
  border: 1px solid rgba(10, 77, 100, 0.1);
  will-change: transform, opacity;

  &.top {
    border-color: rgba(45, 115, 187, 0.35);
    background: rgba(255, 255, 255, 0.88);
  }

  &.top .rank-num {
    background: linear-gradient(135deg, $bill-ribbon-start, $bill-teal);
    color: #fff;
  }
}

.rank-num {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  background: rgba(11, 75, 103, 0.12);
  color: $bill-brand-deep;
  flex-shrink: 0;
}

.rank-body {
  flex: 1;
  min-width: 0;
}

.dept {
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  color: $bill-brand-dark;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(11, 75, 103, 0.12);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, $bill-ribbon-start, $bill-teal);
  width: 0;
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  &.animated {
    width: calc(var(--score) * 1%);
  }
}

.score {
  font-size: 1rem;
  font-weight: 800;
  color: $bill-link-blue;
  flex-shrink: 0;
}

.empty {
  margin-top: 40px;
  @include bill-body-text;
  opacity: 0.6;
}
</style>
