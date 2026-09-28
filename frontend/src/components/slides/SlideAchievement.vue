<template>
  <SlideShell
    character="home"
    char-position="bottom-right"
    overlay="warm"
    sky-variant="achievement"
    :animated="isActive"
  >
    <div ref="rootRef" class="slide-achievement">
      <PageRibbon class="ribbon">风控分类宣导</PageRibbon>

      <div
        class="tree-panel glass-card"
        :class="{ 'is-interacted': hasScrolledHint }"
      >
        <header class="tree-panel__head">
          <div>
            <h2>{{ tree.rootTitle }}</h2>
            <p class="tree-panel__sub">覆盖整改与全链路风险分类</p>
          </div>
          <span class="scroll-hint" aria-hidden="true">上滑浏览</span>
        </header>

        <div
          class="tree-scroll"
          data-bill-scroll
          @pointerdown="onScrollInteract"
          @touchstart.passive="onScrollInteract"
          @wheel="onScrollInteract"
        >
          <div class="vtree">
            <!-- 根 -->
            <div class="vtree-root">
              <div class="node-orb node-orb--root" aria-hidden="true">🌳</div>
              <p>{{ tree.rootTitle }}</p>
            </div>

            <div class="vtree-stem" aria-hidden="true" />

            <!-- 一级：整改 + 风险 -->
            <div class="vtree-fork">
              <div class="vtree-fork__rail" aria-hidden="true" />

              <section class="vtree-branch vtree-branch--rect">
                <div class="vtree-branch__elbow" aria-hidden="true" />
                <div class="branch-node">
                  <div class="node-orb node-orb--rect" aria-hidden="true">
                    {{ tree.rectification.icon }}
                  </div>
                  <div class="branch-node__meta">
                    <h3>{{ tree.rectification.title }}</h3>
                    <span>{{ tree.rectification.items.length }} 类</span>
                  </div>
                </div>
                <ul class="leaf-rail">
                  <li v-for="item in tree.rectification.items" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <section class="vtree-branch vtree-branch--risk">
                <div class="vtree-branch__elbow" aria-hidden="true" />
                <div class="branch-node">
                  <div class="node-orb node-orb--risk" aria-hidden="true">
                    {{ tree.risk.icon }}
                  </div>
                  <div class="branch-node__meta">
                    <h3>{{ tree.risk.title }}</h3>
                    <span>{{ riskCategories.length }} 类</span>
                  </div>
                </div>

                <div class="risk-rail">
                  <article
                    v-for="(cat, index) in riskCategories"
                    :key="cat.name"
                    class="risk-node"
                  >
                    <div class="risk-node__connector" aria-hidden="true" />
                    <div class="risk-node__body">
                      <header>
                        <span class="risk-node__icon" aria-hidden="true">{{
                          cat.icon
                        }}</span>
                        <span class="risk-node__index">{{
                          String(index + 1).padStart(2, '0')
                        }}</span>
                        <h4>{{ cat.name }}</h4>
                      </header>
                      <ul>
                        <li v-for="child in cat.children" :key="child">
                          {{ child }}
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>

          <p class="tree-panel__foot">
            审计防线价值凸显，由抑转扬 · 覆盖全链路风险与整改分类
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
import { mockRiskClassificationTree } from '@/data/riskClassificationTreeData'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)

const store = useBillStore()
const rootRef = ref<HTMLElement | null>(null)
const hasScrolledHint = ref(false)

const tree = computed(
  () =>
    store.billData?.details_data.risk_classification_tree ??
    mockRiskClassificationTree
)

const riskCategories = computed(() => {
  const list: {
    name: string
    icon: string
    children: string[]
  }[] = []
  for (const col of tree.value.risk.columns) {
    list.push({
      name: col.up.name,
      icon: col.up.icon,
      children: col.up.children,
    })
    if (col.down) {
      list.push({
        name: col.down.name,
        icon: col.down.icon,
        children: col.down.children,
      })
    }
  }
  list.push({
    name: tree.value.risk.terminal.name,
    icon: tree.value.risk.terminal.icon,
    children: tree.value.risk.terminal.children,
  })
  return list
})

function onScrollInteract() {
  hasScrolledHint.value = true
}

useIsActiveAnimation(isActive, (tl) => {
  animateSlideEntrance(tl, rootRef.value, ['.ribbon', '.tree-panel'])
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-achievement {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-1) 0 0;
  box-sizing: border-box;
}

.ribbon {
  flex-shrink: 0;
  z-index: 2;
}

.tree-panel {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  flex: 1;
  min-height: 0;
  margin-top: var(--space-3);
  margin-bottom: var(--space-2);
  padding: 14px 0 0;
  display: flex;
  flex-direction: column;
  @include bill-glass-panel;
  overflow: hidden;
}

.tree-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 0 16px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(10, 77, 100, 0.1);

  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: $bill-brand-dark;
  }
}

.tree-panel__sub {
  margin: 3px 0 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: #064057;
}

.scroll-hint {
  flex-shrink: 0;
  font-size: var(--text-2xs);
  font-weight: 700;
  color: #084c48;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 196, 199, 0.14);
  border: 1px solid rgba(0, 196, 199, 0.3);
  animation: hintPulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.tree-panel.is-interacted .scroll-hint {
  animation: none;
  opacity: 0.5;
}

@keyframes hintPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(2px);
  }
}

.tree-scroll {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
  padding: 16px 14px;
}

.vtree {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.vtree-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);

  p {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 800;
    color: $bill-brand-dark;
  }
}

.node-orb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.15rem;
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 6px 14px rgba(2, 18, 38, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  &--root {
    background: linear-gradient(145deg, #0a5c58, #148f88);
  }

  &--rect {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    background: linear-gradient(145deg, #22e4e0, #00c4c7);
  }

  &--risk {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    background: linear-gradient(145deg, #094046, #0a5c58);
  }
}

.vtree-stem {
  width: 6px;
  height: 18px;
  margin: 6px auto 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #0a5c58, #00c4c7);
}

.vtree-fork {
  position: relative;
  margin-top: 0;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  &__rail {
    position: absolute;
    top: 0;
    left: 28px;
    bottom: 24px;
    width: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, #00c4c7, #0a5c58 40%, #148f88);
  }
}

.vtree-branch {
  position: relative;
  padding-left: 18px;

  &__elbow {
    position: absolute;
    top: 16px;
    left: 28px;
    width: 18px;
    height: 6px;
    border-radius: 0 999px 999px 0;
    background: #00c4c7;
  }

  &--risk .vtree-branch__elbow {
    background: #0a5c58;
  }
}

.branch-node {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: 28px;
  margin-bottom: var(--space-2);

  &__meta {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    min-width: 0;

    h3 {
      margin: 0;
      font-size: 0.92rem;
      font-weight: 800;
      color: $bill-brand-dark;
    }

    span {
      font-size: var(--text-2xs);
      font-weight: 800;
      color: #084c48;
    }
  }
}

.leaf-rail {
  margin: 0 0 0 46px;
  padding: 10px 12px;
  list-style: none;
  border-radius: 0 14px 14px 0;
  @include bill-glass-inset;
  border-left: 3.5px solid #00c4c7;

  li {
    position: relative;
    padding: 5px 0 5px 14px;
    font-size: var(--text-xs);
    font-weight: 700;
    color: #042533;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 8px;
      height: 2px;
      background: #00c4c7;
      transform: translateY(-50%);
    }
  }
}

.risk-rail {
  position: relative;
  margin-left: 46px;
  padding-left: 14px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    bottom: 18px;
    left: 0;
    width: 3px;
    border-radius: 999px;
    background: linear-gradient(180deg, #0a5c58, rgba(20, 143, 136, 0.35));
  }
}

.risk-node {
  position: relative;

  &__connector {
    position: absolute;
    top: 18px;
    left: -14px;
    width: 14px;
    height: 3px;
    background: #148f88;
    border-radius: 999px;
  }

  &__body {
    padding: 12px 12px 10px;
    border-radius: 14px;
    @include bill-glass-inset;
  }

  header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(10, 77, 100, 0.08);

    h4 {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 800;
      color: $bill-brand-dark;
      line-height: 1.25;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.72rem;
    background: linear-gradient(145deg, #0a5c58, #148f88);
    border: 1.5px solid rgba(255, 215, 0, 0.65);
  }

  &__index {
    flex-shrink: 0;
    font-size: var(--text-2xs);
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
    color: #08524d;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  li {
    padding: 3px 9px;
    border-radius: 999px;
    font-size: var(--text-2xs);
    font-weight: 700;
    color: #053b38;
    background: rgba(0, 196, 199, 0.18);
  }
}

.tree-panel__foot {
  margin: var(--space-4) 2px 2px;
  padding-top: var(--space-2);
  border-top: 1px solid rgba(10, 77, 100, 0.1);
  font-size: var(--text-xs);
  font-weight: 700;
  color: #064057;
  text-align: center;
  line-height: 1.5;
}

@media (max-height: 720px) {
  .tree-panel {
    margin-top: 8px;
  }

  .tree-scroll {
    padding: 10px;
  }

  .risk-node__body {
    padding: 8px;
  }

  .risk-node header h4 {
    font-size: 0.76rem;
  }

  .risk-node li {
    font-size: 0.58rem;
  }
}
</style>
