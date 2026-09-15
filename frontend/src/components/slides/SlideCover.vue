<template>
  <div ref="rootRef" class="slide-cover">
    <BillSkyBackground variant="cover" :animated="coverAnimated" />

    <div class="content">
      <!-- 顶部品牌 -->
      <div class="top-bar">
        <div class="brand">LINSY 林氏</div>
      </div>

      <!-- 顶部核心主题标语 -->
      <div class="headline-tag">
        <span>{{ headline }}</span>
      </div>

      <div class="title-block">
        <h1 class="main-title">做自己的<br />追光者！</h1>
        <div class="shooting-star-line" aria-hidden="true" />
      </div>

      <div class="subtitle-block" v-if="subtitleText">
        <p class="subtitle-text">{{ titleText }} · {{ subtitleText }}</p>
      </div>

      <!-- 底部开启行动区 -->
      <div class="bottom-action">
        <button
          type="button"
          class="start-btn"
          @click.stop.prevent="handleStart"
        >
          立刻开启
        </button>
      </div>

      <!-- 底部与海报一致的品质小字 -->
      <div class="footer-bar">
        <span class="footer-eng">WIN IN INTEGRITY</span>
        <span class="footer-cn">{{ displayYear }} 林氏廉洁月</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SlideProps } from '@/types/bill'
import { useBillStore } from '@/stores/billStore'
import { useIsActiveAnimation } from '@/composables/useIsActiveAnimation'
import { useBillGoNext, useBillSlide } from '@/composables/useBillSlide'
import BillSkyBackground from '@/components/common/BillSkyBackground.vue'

const props = defineProps<SlideProps>()

const { isActive } = useBillSlide(props.slideIndex)
const goNext = useBillGoNext()
const coverAnimated = computed(() => isActive.value ?? true)
const rootRef = ref<HTMLElement | null>(null)

const store = useBillStore()
const page = computed(() => store.visiblePages.find((p) => p.type === 'cover'))

const headline = computed(
  () =>
    (page.value && 'headline' in page.value && page.value.headline) ||
    '2025年风险账单来啦!'
)
const titleText = computed(
  () => (page.value && 'title' in page.value && page.value.title) || '征途坎坷成画'
)
const subtitleText = computed(
  () =>
    (page.value && 'subtitle' in page.value && page.value.subtitle) || '沿途波澜皆景'
)

const displayYear = computed(() => {
  return store.billData?.user.year || new Date().getFullYear()
})

function handleStart() {
  void goNext()
}

useIsActiveAnimation(
  isActive,
  (tl) => {
    const scope = rootRef.value
    if (!scope) return
    tl.from(scope.querySelector('.headline-tag'), {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
    tl.from(
      scope.querySelector('.title-block'),
      {
        y: 28,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.2'
    )
    tl.from(
      scope.querySelector('.subtitle-block'),
      {
        opacity: 0,
        y: 14,
        duration: 0.6,
      },
      '-=0.4'
    )
    tl.from(
      scope.querySelector('.start-btn'),
      {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.4)',
      },
      '-=0.3'
    )
    tl.from(
      scope.querySelector('.footer-bar'),
      {
        opacity: 0,
        duration: 0.6,
      },
      '-=0.3'
    )
  },
  { resetOnLeave: false }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-cover {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  padding: max(20px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.top-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.brand {
  font-size: clamp(1rem, 3.8vw, 1.15rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
  text-shadow:
    0 2px 10px rgba(2, 18, 38, 0.7),
    0 0 16px rgba(34, 228, 224, 0.4);
}

.headline-tag {
  align-self: flex-start;
  margin-top: clamp(24px, 5.5vh, 48px);
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(2, 28, 54, 0.55);
  border: 1px solid rgba(34, 228, 224, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);

  span {
    font-size: clamp(0.78rem, 2.8vw, 0.92rem);
    font-weight: 800;
    color: $bill-accent-yellow;
    letter-spacing: 1px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.45);
  }
}

.title-block {
  align-self: flex-start;
  margin-top: 14px;
  position: relative;
  text-align: left;
}

.main-title {
  margin: 0;
  font-size: clamp(3.1rem, 13vw, 4.8rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: 1.5px;
  font-style: italic;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #fff;
  text-shadow:
    3px 4px 0 $bill-space-deep,
    0 0 30px rgba(34, 228, 224, 0.45),
    0 8px 24px rgba(2, 18, 38, 0.6);
}

.shooting-star-line {
  position: absolute;
  left: 2px;
  bottom: -6px;
  width: min(220px, 60vw);
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #fff 0%, $bill-accent-yellow 40%, rgba(255, 140, 0, 0) 100%);
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.7);

  &::after {
    content: '★';
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%) rotate(12deg);
    font-size: 14px;
    color: $bill-accent-yellow;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.9);
  }
}

.subtitle-block {
  margin-top: 18px;
  align-self: flex-start;
}

.subtitle-text {
  margin: 0;
  font-size: clamp(0.85rem, 3.2vw, 1.05rem);
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(2, 18, 38, 0.6);
}

.bottom-action {
  margin-top: auto;
  margin-bottom: clamp(24px, 5vh, 44px);
  width: 100%;
  display: flex;
  justify-content: center;
}

.start-btn {
  width: min(280px, 78vw);
  border-radius: 999px;
  padding: 13px 36px;
  font-size: clamp(1.35rem, 5.2vw, 1.65rem);
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;
  font-family: inherit;
  @include bill-cta-button;

  &:active {
    transform: translateY(3px) scale(0.98);
    box-shadow:
      0 4px 0 $bill-accent-gold-shadow,
      0 8px 16px rgba(255, 140, 0, 0.3);
  }

  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 4px;
  }
}

.footer-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(0.68rem, 2.4vw, 0.78rem);
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.78);
  text-shadow: 0 1px 8px rgba(2, 18, 38, 0.8);
}

.footer-eng {
  text-transform: uppercase;
}

@media (max-width: 375px) {
  .main-title {
    font-size: 2.85rem;
  }

  .start-btn {
    width: 240px;
    font-size: 1.25rem;
    padding: 11px 28px;
  }
}

@media (max-height: 700px) {
  .headline-tag {
    margin-top: 16px;
  }

  .main-title {
    font-size: 2.65rem;
  }

  .bottom-action {
    margin-bottom: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .start-btn {
    transition: none;
  }
}
</style>
