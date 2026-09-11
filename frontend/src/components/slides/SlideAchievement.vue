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
  padding: 4px 0 0;
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
  margin-top: 12px;
  margin-bottom: 8px;
  padding: 12px 0 0;
  display: flex;
  flex-direction: column;
  @include bill-glass-panel;
  overflow: hidden;
}

.tree-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 0 14px 10px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(10, 77, 100, 0.08);

  h2 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: $bill-brand-dark;
  }
}

.tree-panel__sub {
  margin: 3px 0 0;
  font-size: 0.62rem;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.55);
}

.scroll-hint {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(5, 46, 44, 0.55);
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(10, 77, 100, 0.08);
  animation: hintPulse 2.2s ease-in-out infinite;
}

.tree-panel.is-interacted .scroll-hint {
  animation: none;
  opacity: 0.5;
}

@keyframes hintPulse {
  0%,
  100% {
    opacity: 0.55;
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
  padding: 14px 12px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(20, 143, 136, 0.4) transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(20, 143, 136, 0.4);
    border-radius: 999px;
  }
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
  gap: 8px;

  p {
    margin: 0;
    font-size: 0.78rem;
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
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.75);
  box-shadow:
    0 6px 14px rgba(4, 31, 36, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);

  &--root {
    background: linear-gradient(145deg, #0a5c58, #148f88);
  }

  &--rect {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    background: linear-gradient(145deg, #40e0d0, #20b2aa);
  }

  &--risk {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    background: linear-gradient(145deg, #0a3d42, #0a5c58);
  }
}

.vtree-stem {
  width: 6px;
  height: 18px;
  margin: 6px auto 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #0a5c58, #20b2aa);
}

.vtree-fork {
  position: relative;
  margin-top: 0;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__rail {
    position: absolute;
    top: 0;
    left: 28px;
    bottom: 24px;
    width: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, #20b2aa, #0a5c58 40%, #148f88);
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
    background: #20b2aa;
  }

  &--risk .vtree-branch__elbow {
    background: #0a5c58;
  }
}

.branch-node {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 28px;
  margin-bottom: 10px;

  &__meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;

    h3 {
      margin: 0;
      font-size: 0.88rem;
      font-weight: 800;
      color: $bill-brand-dark;
    }

    span {
      font-size: 0.62rem;
      font-weight: 700;
      color: rgba(5, 46, 44, 0.5);
    }
  }
}

.leaf-rail {
  margin: 0 0 0 46px;
  padding: 8px 10px;
  list-style: none;
  border-left: 3px solid rgba(32, 178, 170, 0.45);
  border-radius: 0 12px 12px 0;
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-left-width: 3px;
  border-left-color: rgba(32, 178, 170, 0.55);

  li {
    position: relative;
    padding: 4px 0 4px 12px;
    font-size: 0.7rem;
    font-weight: 650;
    color: rgba(5, 46, 44, 0.84);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 8px;
      height: 2px;
      background: rgba(32, 178, 170, 0.65);
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
  gap: 10px;

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
    padding: 10px 10px 9px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.58);
    border: 1px solid rgba(255, 255, 255, 0.65);
    box-shadow: 0 3px 10px rgba(4, 31, 36, 0.08);
  }

  header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 7px;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(10, 77, 100, 0.08);

    h4 {
      margin: 0;
      font-size: 0.78rem;
      font-weight: 800;
      color: $bill-brand-dark;
      line-height: 1.25;
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.68rem;
    background: linear-gradient(145deg, #0a5c58, #148f88);
    border: 1.5px solid rgba(255, 231, 86, 0.55);
  }

  &__index {
    flex-shrink: 0;
    font-size: 0.58rem;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    color: rgba(20, 143, 136, 0.7);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  li {
    padding: 3px 7px;
    border-radius: 999px;
    font-size: 0.6rem;
    font-weight: 650;
    color: rgba(5, 46, 44, 0.8);
    background: rgba(64, 224, 208, 0.16);
  }
}

.tree-panel__foot {
  margin: 16px 2px 2px;
  padding-top: 10px;
  border-top: 1px solid rgba(10, 77, 100, 0.08);
  font-size: 0.62rem;
  font-weight: 600;
  color: rgba(5, 46, 44, 0.58);
  text-align: center;
  line-height: 1.45;
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
    font-size: 0.72rem;
  }

  .risk-node li {
    font-size: 0.56rem;
  }
}
</style>
