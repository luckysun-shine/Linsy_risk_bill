<template>
  <div ref="rootRef" class="slide-placeholder">
    <div class="page-content">
      <div class="card" :style="{ backgroundImage: `url(${cardBg})` }">
        <h2 class="page-title">{{ titleText }}</h2>
        <div class="page-body">
          <p class="desc">{{ descText }}</p>
        </div>
      </div>
      <img :src="charImg" class="char-decoration" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PlaceholderPageConfig, SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useBillSlide } from '@/composables/useBillSlide'
import { formatText } from '@/utils/formatText'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import cardBg from '@/assets/images/card-bg.png'
import char1 from '@/assets/images/char-detail-1.png'
import char2 from '@/assets/images/char-detail-2.png'

const props = defineProps<
  SlideProps & {
    pageConfig: PlaceholderPageConfig
  }
>()
const { isActive } = useBillSlide(props.slideIndex)
const rootRef = ref<HTMLElement | null>(null)

const store = useBillStore()
const vars = computed(() => store.templateVars)

const titleText = computed(() => formatText(props.pageConfig.title ?? '精彩内容', vars.value))
const descText = computed(() => formatText(props.pageConfig.desc ?? '', vars.value))

const charImg = computed(() => {
  if (props.pageConfig.char_image) return props.pageConfig.char_image
  const idx = props.slideIndex
  return idx % 2 === 0 ? char1 : char2
})

useIsActiveAnimation(isActive, (tl) => {
  const scope = rootRef.value
  if (!scope) return
  tl.from(scope.querySelector('.card'), { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' })
  tl.from(scope.querySelector('.char-decoration'), { x: 40, opacity: 0, duration: 0.6 }, '-=0.3')
})
</script>

<style lang="scss" scoped>
.slide-placeholder {
  width: 100%;
  height: 100%;
}

.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.card {
  width: 90%;
  height: 60%;
  background-size: 100% 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #0a4d64;
  font-weight: 800;
}

.desc {
  font-size: 1.1rem;
  color: #333;
  text-align: center;
  line-height: 1.6;
}

.char-decoration {
  position: absolute;
  bottom: 0;
  right: 10%;
  width: 150px;
  z-index: 3;
}
</style>
