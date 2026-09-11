<template>
  <div class="bill-view" :class="{ 'is-swiping': isSwiping }">
    <SlideLoading v-if="!isReady" :error="errorMessage" />

    <swiper
      v-else
      :direction="'vertical'"
      :modules="modules"
      :threshold="8"
      :long-swipes-ratio="0.25"
      :resistance-ratio="0.7"
      :touch-angle="35"
      :touch-release-on-edges="false"
      :follow-finger="true"
      :passive-listeners="false"
      :prevent-interaction-on-transition="true"
      :speed="320"
      class="bill-swiper"
      @swiper="onSwiper"
      @slider-first-move="onSwipeStart"
      @touch-end="onSwipeEnd"
      @slide-change-transition-start="onSlideTransitionStart"
      @slide-change-transition-end="onSlideTransitionEnd"
    >
      <swiper-slide
        v-for="(page, index) in visiblePages"
        :key="`${page.type}-${index}`"
      >
        <div class="slide-host">
          <component
            v-if="isSlideMounted(index)"
            :is="resolveSlide(page.type)"
            v-bind="getSlideProps(page, index)"
          />
        </div>
      </swiper-slide>
    </swiper>

    <template v-if="isReady">
      <BgmPlayer :src="bgmSrc" />
      <SwipeHint :visible="showSwipeHint" :on-cover="activeIndex === 0" />
    </template>

    <LandscapeTip />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import { useBillStore } from '@/stores/billStore'
import type { PageConfigItem, PageType } from '@/types/bill'
import { billActiveIndexKey, billGoNextKey } from '@/composables/useBillSlide'
import { installBillTouchGuard } from '@/composables/useBillTouchGuard'
import SlideLoading from '@/components/slides/SlideLoading.vue'
import SlideCover from '@/components/slides/SlideCover.vue'
import BgmPlayer from '@/components/common/BgmPlayer.vue'
import SwipeHint from '@/components/common/SwipeHint.vue'
import LandscapeTip from '@/components/common/LandscapeTip.vue'

const slideLoaders: Record<string, () => Promise<unknown>> = {
  stats: () => import('@/components/slides/SlideStats.vue'),
  risk_pie: () => import('@/components/slides/SlideRiskPie.vue'),
  risk_rectification: () =>
    import('@/components/slides/SlideRiskRectification.vue'),
  milestone: () => import('@/components/slides/SlideMilestone.vue'),
  dept_focus: () => import('@/components/slides/SlideDeptFocus.vue'),
  cluster: () => import('@/components/slides/SlideCluster.vue'),
  achievement: () => import('@/components/slides/SlideAchievement.vue'),
  manager: () => import('@/components/slides/SlideManagerRank.vue'),
  placeholder: () => import('@/components/slides/SlidePlaceholder.vue'),
  poster: () => import('@/components/slides/SlidePoster.vue'),
}

const SlideStats = defineAsyncComponent(slideLoaders.stats)
const SlideRiskPie = defineAsyncComponent(slideLoaders.risk_pie)
const SlideRiskRectification = defineAsyncComponent(
  slideLoaders.risk_rectification
)
const SlideMilestone = defineAsyncComponent(slideLoaders.milestone)
const SlideDeptFocus = defineAsyncComponent(slideLoaders.dept_focus)
const SlideCluster = defineAsyncComponent(slideLoaders.cluster)
const SlideAchievement = defineAsyncComponent(slideLoaders.achievement)
const SlideManagerRank = defineAsyncComponent(slideLoaders.manager)
const SlidePlaceholder = defineAsyncComponent(slideLoaders.placeholder)
const SlidePoster = defineAsyncComponent(slideLoaders.poster)

const modules: unknown[] = []

const store = useBillStore()
const route = useRoute()
const { isReady, visiblePages, billData, errorMessage } = storeToRefs(store)

const swiperRef = shallowRef<SwiperInstance | null>(null)
const activeIndex = ref(0)
const isSwiping = ref(false)
/** 预挂载窗口：当前页 ±2，避免滑动手势中途创建组件 */
const mountedSlides = ref<number[]>([0])
let unbindTouchGuard: (() => void) | null = null
let swipeEndTimer: ReturnType<typeof setTimeout> | null = null
let prefetchTimer: ReturnType<typeof setTimeout> | null = null

provide(billActiveIndexKey, activeIndex)

const bgmSrc = computed(() => billData.value?.assets?.bgm || '/audio/bgm.mp3')

const showSwipeHint = computed(() => {
  const last = visiblePages.value.length - 1
  return activeIndex.value >= 0 && activeIndex.value < last
})

function isSlideMounted(index: number) {
  return mountedSlides.value.includes(index)
}

function ensureSlideMounted(index: number) {
  const last = visiblePages.value.length - 1
  if (index < 0 || index > last) return
  if (mountedSlides.value.includes(index)) return
  mountedSlides.value = [...mountedSlides.value, index]
}

/** 只在空闲时扩展挂载窗口，绝不在 touchMove 中触发 */
function mountWindow(center: number, radius = 2) {
  const last = visiblePages.value.length - 1
  const next = new Set(mountedSlides.value)
  for (let i = center - radius; i <= center + radius; i++) {
    if (i >= 0 && i <= last) next.add(i)
  }
  const merged = [...next].sort((a, b) => a - b)
  if (
    merged.length === mountedSlides.value.length &&
    merged.every((v, i) => v === mountedSlides.value[i])
  ) {
    return
  }
  mountedSlides.value = merged
}

function getSlideProps(page: PageConfigItem, index: number) {
  if (page.type === 'placeholder' || page.type === 'dept_focus') {
    return { slideIndex: index, pageConfig: page }
  }
  return { slideIndex: index }
}

function resolveSlide(type: PageType) {
  switch (type) {
    case 'cover':
      return SlideCover
    case 'stats':
      return SlideStats
    case 'manager':
      return SlideManagerRank
    case 'risk_pie':
      return SlideRiskPie
    case 'risk_rectification':
      return SlideRiskRectification
    case 'milestone':
      return SlideMilestone
    case 'dept_focus':
      return SlideDeptFocus
    case 'cluster':
      return SlideCluster
    case 'achievement':
      return SlideAchievement
    case 'placeholder':
      return SlidePlaceholder
    case 'poster':
      return SlidePoster
    default:
      return SlideCover
  }
}

async function prefetchSlideModules() {
  const types = new Set(visiblePages.value.map((p) => p.type))
  await Promise.all(
    [...types].map(async (type) => {
      const loader = slideLoaders[type]
      if (loader) {
        try {
          await loader()
        } catch {
          /* ignore */
        }
      }
    })
  )
}

async function goToNextSlide() {
  const swiper = swiperRef.value
  if (!swiper || swiper.destroyed) return
  const nextIndex = swiper.activeIndex + 1
  if (nextIndex >= visiblePages.value.length) return

  mountWindow(nextIndex, 2)
  await nextTick()
  requestAnimationFrame(() => {
    if (!swiper.destroyed) swiper.slideNext()
  })
}

provide(billGoNextKey, goToNextSlide)

const onSwiper = (swiper: SwiperInstance) => {
  swiperRef.value = swiper
  activeIndex.value = swiper.activeIndex
  mountWindow(swiper.activeIndex, 2)
}

const onSwipeStart = () => {
  if (swipeEndTimer) {
    clearTimeout(swipeEndTimer)
    swipeEndTimer = null
  }
  isSwiping.value = true
}

const onSwipeEnd = () => {
  if (swipeEndTimer) clearTimeout(swipeEndTimer)
  swipeEndTimer = setTimeout(() => {
    isSwiping.value = false
    swipeEndTimer = null
  }, 80)
}

const onSlideTransitionStart = (swiper: SwiperInstance) => {
  isSwiping.value = true
  activeIndex.value = swiper.activeIndex
}

const onSlideTransitionEnd = (swiper: SwiperInstance) => {
  activeIndex.value = swiper.activeIndex
  isSwiping.value = false
  // 翻页结束后再扩展挂载，避免手势中途卡顿
  requestAnimationFrame(() => {
    mountWindow(swiper.activeIndex, 2)
  })
}

watch(isReady, (ready) => {
  if (!ready) return
  mountWindow(0, 2)
  void prefetchSlideModules().then(() => {
    if (prefetchTimer) clearTimeout(prefetchTimer)
    prefetchTimer = setTimeout(() => {
      // 空闲时把窗口再扩一点，后续翻页更顺
      mountWindow(activeIndex.value, 3)
    }, 600)
  })
})

onMounted(() => {
  const token = typeof route.query.token === 'string' ? route.query.token : undefined
  const yearParam = route.params.year
  const year =
    typeof yearParam === 'string' && yearParam
      ? parseInt(yearParam, 10)
      : undefined
  void store.init(token, Number.isFinite(year) ? year : undefined)

  unbindTouchGuard = installBillTouchGuard({
    getSwiper: () => swiperRef.value,
  })
})

onUnmounted(() => {
  unbindTouchGuard?.()
  unbindTouchGuard = null
  if (swipeEndTimer) clearTimeout(swipeEndTimer)
  if (prefetchTimer) clearTimeout(prefetchTimer)
})
</script>

<style lang="scss" scoped>
.bill-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.bill-swiper {
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  overscroll-behavior: none;

  :deep(.swiper-wrapper) {
    height: 100%;
  }

  :deep(.swiper-slide) {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    contain: layout paint style;
  }

  /* 非相邻页降低渲染成本 */
  :deep(.swiper-slide:not(.swiper-slide-active):not(.swiper-slide-next):not(.swiper-slide-prev)) {
    content-visibility: hidden;
  }
}

.slide-host {
  width: 100%;
  height: 100%;
}

/* 滑动过程中：暂停特效、关掉毛玻璃，显著降低掉帧 */
.bill-view.is-swiping {
  :deep(.bill-sky--animated *),
  :deep(.cosmic-effects--animated *),
  :deep(.cosmic-journey--animated *) {
    animation-play-state: paused !important;
  }

  :deep(.glass-card),
  :deep(.bill-paper),
  :deep(.tree-panel),
  :deep(.stats-card),
  :deep(.metric-bar),
  :deep(.panel) {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}
</style>
