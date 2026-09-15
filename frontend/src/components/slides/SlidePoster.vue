<template>
  <SlideShell
    character="none"
    overlay="light"
    :show-deco="false"
    sky-variant="poster"
    :animated="isActive"
  >
    <div class="slide-poster">
      <PageRibbon class="ribbon">年度荣誉卡</PageRibbon>

      <div class="poster-wrap">
        <div ref="cardRef" class="honor-card" :style="{ backgroundImage: `url(${cardBg})` }">
          <img :src="IP_ASSETS.home" class="card-ip" alt="" />
          <p class="year">2025 风控年度账单</p>
          <h2 class="name">{{ userName }}</h2>
          <p class="dept">{{ department }}</p>
          <div class="keyword-wrap">
            <span class="keyword">{{ keyword }}</span>
          </div>
          <p class="footer">长按保存海报，分享你的风控故事</p>
        </div>
      </div>

      <p v-if="generating" class="tip">海报生成中…</p>
      <p v-else-if="posterDataUrl" class="tip">长按上方卡片保存图片</p>

      <img
        v-if="posterDataUrl"
        :src="posterDataUrl"
        class="poster-preview"
        alt="年度海报"
      />
    </div>
  </SlideShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { usePoster } from '@/composables/usePoster'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { IP_ASSETS } from '@/constants/ipAssets'
import SlideShell from '@/components/common/SlideShell.vue'
import PageRibbon from '@/components/common/PageRibbon.vue'
import cardBg from '@/assets/images/card-bg.png'

const props = defineProps<SlideProps>()
const { isActive } = useBillSlide(props.slideIndex)
const cardRef = ref<HTMLElement | null>(null)

const store = useBillStore()
const userName = computed(() => store.billData?.user.name ?? '--')
const department = computed(() => store.billData?.user.department ?? '--')
const keyword = computed(() => store.billData?.summary_data.keyword ?? '风控守护者')

const { posterDataUrl, generating, generateFromElement, clearPoster } = usePoster()

useIsActiveAnimation(isActive, (tl) => {
  const scope = cardRef.value
  if (!scope) return
  tl.from(scope, { scale: 0.92, opacity: 0, duration: 0.7, ease: 'back.out(1.4)' })
  tl.from('.card-ip', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
})

watch(
  isActive,
  async (active) => {
    if (!active) {
      clearPoster()
      return
    }
    await new Promise((r) => setTimeout(r, 400))
    if (isActive.value) {
      await generateFromElement(cardRef.value)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-poster {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--space-1);
  padding-bottom: max(72px, env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.ribbon {
  flex-shrink: 0;
}

.poster-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: var(--space-2);
}

.honor-card {
  position: relative;
  width: min(340px, 88vw);
  padding: 36px 24px 26px;
  border-radius: 22px;
  background-size: 100% 100%;
  text-align: center;
  box-shadow: $bill-card-shadow;
  background-color: $bill-card-glass-solid;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.card-ip {
  position: absolute;
  right: -8px;
  top: -24px;
  width: min(104px, 28vw);
  filter: drop-shadow(0 8px 16px rgba(2, 18, 38, 0.25));
}

.year {
  margin: 0;
  font-size: var(--text-xs);
  color: #064057;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.name {
  margin: 12px 0 4px;
  font-size: 1.75rem;
  color: $bill-brand-dark;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.dept {
  margin: 0;
  font-size: var(--text-sm);
  color: #0b5f7e;
  font-weight: 650;
}

.keyword-wrap {
  margin: 22px auto 16px;
  padding: 12px 18px;
  border: 2px dashed rgba(255, 140, 0, 0.45);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 248, 220, 0.6) 0%, rgba(255, 235, 150, 0.3) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.keyword {
  font-size: 1.3rem;
  font-weight: 900;
  color: #054863;
  letter-spacing: 1px;
}

.footer {
  margin: 0;
  font-size: var(--text-xs);
  color: #084c48;
  font-weight: 600;
}

.tip {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 8px rgba(2, 18, 38, 0.7);
}

.poster-preview {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
