<template>
  <div ref="rootRef" class="slide-cover">
    <BillSkyBackground variant="cover" :animated="coverAnimated" />

    <div class="cover-deco" aria-hidden="true">
      <GlassLampDeco
        class="cover-deco__lamp"
        size="lg"
        :animated="coverAnimated"
      />
      <SoftGlowStar
        class="cover-deco__star cover-deco__star--a"
        variant="gold"
        :animated="coverAnimated"
      />
      <SoftGlowStar
        class="cover-deco__star cover-deco__star--b"
        variant="cyan"
        :animated="coverAnimated"
      />
    </div>

    <div class="content">
      <div class="brand">LINSY 林氏</div>

      <div class="headline-ribbon">
        <span>{{ headline }}</span>
      </div>

      <div class="title-block">
        <h1 class="title">{{ titleText }}</h1>
        <h2 class="subtitle">{{ subtitleText }}</h2>
      </div>

      <div class="cta-area">
        <img src="@/assets/images/char-home.png" class="char-img" alt="" />
        <button type="button" class="start-btn" @click.stop.prevent="handleStart">立刻开启</button>
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
import GlassLampDeco from '@/components/common/GlassLampDeco.vue'
import SoftGlowStar from '@/components/common/SoftGlowStar.vue'

const props = defineProps<SlideProps>()

const { isActive } = useBillSlide(props.slideIndex)
const goNext = useBillGoNext()
/** 首页常驻星际穿梭动效（流星、光轨等） */
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

function handleStart() {
  void goNext()
}

useIsActiveAnimation(
  isActive,
  (tl) => {
  const scope = rootRef.value
  if (!scope) return
  tl.from(scope.querySelector('.headline-ribbon'), { y: -30, opacity: 0, duration: 0.6 })
  tl.from(
    scope.querySelector('.cover-deco__lamp'),
    { y: 18, opacity: 0, scale: 0.88, duration: 0.75, ease: 'power2.out' },
    '-=0.15'
  )
  tl.from(scope.querySelector('.title-block'), { y: 24, opacity: 0, duration: 0.8 }, '-=0.1')
  tl.from(
    scope.querySelector('.char-img'),
    { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' },
    '-=0.4'
  )
  tl.from(
    scope.querySelector('.start-btn'),
    { scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' },
    '-=0.35'
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

.cover-deco {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.cover-deco__lamp {
  position: absolute;
  top: 38%;
  right: 8%;
  left: auto;
  opacity: 0.92;
  transform: translateY(-50%);
  z-index: 2;
}

.cover-deco__star {
  position: absolute;
}

.cover-deco__star--a {
  top: 28%;
  right: 22%;
  left: auto;
  width: 38px;
  height: 38px;
  opacity: 0.88;
  animation-delay: 0.6s;
}

.cover-deco__star--b {
  top: 52%;
  right: 28%;
  left: auto;
  width: 24px;
  height: 24px;
  opacity: 0.7;
  animation-delay: 1.2s;
}

.content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  padding: max(24px, env(safe-area-inset-top)) 20px max(30px, env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
  margin-top: 2px;
  text-shadow: 0 2px 12px rgba(4, 31, 36, 0.35);
}

.headline-ribbon {
  margin-top: 30px;
  background: linear-gradient(90deg, $bill-mint, $bill-aurora);
  color: #fff;
  font-size: clamp(1.45rem, 5.2vw, 1.95rem);
  font-weight: 800;
  letter-spacing: 1px;
  padding: 7px 32px;
  transform: skew(-8deg);
  box-shadow:
    0 6px 0 $bill-ribbon-shadow,
    0 0 28px rgba(64, 224, 208, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.35);
  position: relative;
  z-index: 4;

  span {
    display: inline-block;
    transform: skew(8deg);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    width: 6px;
    height: 34px;
    background: rgba(255, 255, 255, 0.35);
  }

  &::before {
    left: 8px;
  }

  &::after {
    right: 8px;
  }
}

.title-block {
  margin-top: 24vh;
  text-align: center;
  z-index: 4;
  transform: rotate(-4deg);
  transform-origin: center center;
}

.title,
.subtitle {
  margin: 0;
  color: #fff;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 1px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-style: italic;
  text-shadow:
    3px 3px 0 $bill-title-shadow,
    0 0 24px rgba(64, 224, 208, 0.35);
}

.title {
  font-size: clamp(2.45rem, 9.4vw, 4.4rem);
}

.subtitle {
  margin-top: 10px;
  font-size: clamp(2.3rem, 9vw, 4rem);
}

.cta-area {
  position: absolute;
  left: 50%;
  bottom: 48px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}

.char-img {
  width: min(186px, 42vw);
  object-fit: contain;
  margin-bottom: -10px;
  transform: translateX(-92px);
  filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.16));
}

.start-btn {
  min-width: min(340px, 76vw);
  border-radius: 999px;
  padding: 12px 38px;
  font-size: clamp(2rem, 6.8vw, 2.55rem);
  line-height: 1;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  font-family: inherit;
  @include bill-cta-button;

  &:active {
    transform: translateY(3px);
    box-shadow:
      0 4px 0 $bill-accent-gold-shadow,
      0 10px 18px rgba(255, 140, 0, 0.28);
  }
}

@media (max-width: 420px) {
  .cover-deco__lamp {
    top: 36%;
    right: 4%;
    transform: translateY(-50%) scale(0.82);
    transform-origin: center right;
  }

  .cover-deco__star--a {
    width: 30px;
    height: 30px;
    right: 18%;
    top: 26%;
  }

  .cover-deco__star--b {
    width: 18px;
    height: 18px;
    right: 24%;
    top: 50%;
  }

  .headline-ribbon {
    margin-top: 24px;
    padding: 7px 28px;
    font-size: 1.45rem;
  }

  .title-block {
    margin-top: 28vh;
  }

  .title {
    font-size: 2.15rem;
  }

  .subtitle {
    font-size: 2rem;
  }

  .char-img {
    width: 150px;
    transform: translateX(-58px);
  }

  .start-btn {
    min-width: 248px;
    font-size: 1.8rem;
    padding: 11px 28px;
  }
}

@media (min-height: 900px) {
  .title-block {
    margin-top: 27vh;
  }

  .cta-area {
    bottom: 64px;
  }
}

@media (max-height: 700px) {
  .title-block {
    margin-top: 18vh;
  }

  .cta-area {
    bottom: 30px;
  }

  .start-btn {
    font-size: 1.65rem;
  }
}
</style>
