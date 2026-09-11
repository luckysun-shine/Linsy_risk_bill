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
  padding-top: 4px;
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
  margin-top: 12px;
}

.honor-card {
  position: relative;
  width: min(340px, 88vw);
  padding: 36px 24px 28px;
  border-radius: 20px;
  background-size: 100% 100%;
  text-align: center;
  box-shadow: $bill-card-shadow;
  background-color: $bill-card-glass;
}

.card-ip {
  position: absolute;
  right: -8px;
  top: -20px;
  width: min(100px, 26vw);
  filter: drop-shadow(0 6px 10px rgba(8, 66, 93, 0.15));
}

.year {
  font-size: 0.88rem;
  color: $bill-brand-deep;
  letter-spacing: 2px;
  font-weight: 600;
}

.name {
  margin: 14px 0 4px;
  font-size: 1.65rem;
  color: $bill-brand-dark;
  font-weight: 800;
}

.dept {
  font-size: 0.9rem;
  color: $bill-brand;
}

.keyword-wrap {
  margin: 24px auto 18px;
  padding: 14px 18px;
  border: 2px dashed $bill-accent-gold;
  border-radius: 12px;
  background: rgba(255, 239, 0, 0.18);
}

.keyword {
  font-size: 1.25rem;
  font-weight: 800;
  color: $bill-link-blue;
}

.footer {
  font-size: 0.78rem;
  color: $bill-brand;
  opacity: 0.85;
}

.tip {
  margin-top: 8px;
  font-size: 0.85rem;
  @include bill-body-text;
  opacity: 0.85;
}

.poster-preview {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
