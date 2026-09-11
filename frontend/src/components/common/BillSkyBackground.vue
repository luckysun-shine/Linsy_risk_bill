<template>
  <div
    class="bill-sky"
    :class="[`bill-sky--${variant}`, { 'bill-sky--animated': animated }]"
    aria-hidden="true"
  >
    <div class="bill-sky__base" />
    <div class="bill-sky__grain" />
    <div class="bill-sky__mesh" />
    <CosmicJourneyLayer
      v-if="animated"
      :animated="animated"
      :intensity="journeyIntensity"
    />
    <CosmicEffects
      v-if="animated"
      :animated="animated"
      :show-lamp="showCosmicLamp"
      :intensity="journeyIntensity"
    />
    <div class="bill-sky__star-dust" />
    <div class="bill-sky__stars" />
    <div class="bill-sky__wash" />

    <img
      v-for="(cloud, index) in cloudLayers"
      :key="`${variant}-cloud-${index}`"
      :src="cloud.src"
      class="bill-sky__cloud"
      :class="cloud.className"
      alt=""
    />

    <template v-if="showDeco">
      <img
        v-if="decoLines !== 'none' && decoLines !== 'right'"
        src="@/assets/images/deco-line.png"
        class="bill-sky__deco line-left"
        alt=""
      />
      <img
        v-if="decoLines !== 'none' && decoLines !== 'left'"
        src="@/assets/images/deco-line.png"
        class="bill-sky__deco line-right"
        alt=""
      />
      <div v-if="showSun" class="bill-sky__sun" />
    </template>

    <div v-if="showGlow" class="bill-sky__glow" />
    <div v-if="showRays" class="bill-sky__rays" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  resolveSkyVariant,
  SKY_CLOUDS,
  type SkyBgVariant,
} from '@/constants/pageBackgrounds'
import type { PageType } from '@/types/bill'
import CosmicEffects from '@/components/common/CosmicEffects.vue'
import CosmicJourneyLayer from '@/components/common/CosmicJourneyLayer.vue'

const props = withDefaults(
  defineProps<{
    variant?: SkyBgVariant
    pageType?: PageType | 'loading'
    showDeco?: boolean
    animated?: boolean
  }>(),
  {
    showDeco: true,
    animated: false,
  }
)

const variant = computed(() => resolveSkyVariant(props.variant, props.pageType))

type CloudLayer = { src: string; className: string }

const cloudLayers = computed<CloudLayer[]>(() => {
  switch (variant.value) {
    case 'loading':
      return [
        { src: SKY_CLOUDS.cloud1, className: 'cloud-a' },
        { src: SKY_CLOUDS.cloud2, className: 'cloud-b' },
      ]
    case 'cover':
      return [{ src: SKY_CLOUDS.cloud2, className: 'cloud-c' }]
    case 'stats':
      return [
        { src: SKY_CLOUDS.cloud1, className: 'cloud-d' },
        { src: SKY_CLOUDS.cloud2, className: 'cloud-e' },
      ]
    case 'manager':
      return [{ src: SKY_CLOUDS.cloud2, className: 'cloud-f' }]
    case 'risk_pie':
      return [
        { src: SKY_CLOUDS.cloud1, className: 'cloud-g' },
        { src: SKY_CLOUDS.cloud2, className: 'cloud-h' },
      ]
    case 'risk_rectification':
      return [
        { src: SKY_CLOUDS.cloud2, className: 'cloud-g' },
        { src: SKY_CLOUDS.cloud1, className: 'cloud-h' },
      ]
    case 'milestone':
      return [{ src: SKY_CLOUDS.cloud1, className: 'cloud-i' }]
    case 'cluster':
      return [
        { src: SKY_CLOUDS.cloud1, className: 'cloud-j' },
        { src: SKY_CLOUDS.cloud2, className: 'cloud-k' },
        { src: SKY_CLOUDS.cloud1, className: 'cloud-l' },
      ]
    case 'achievement':
      return [
        { src: SKY_CLOUDS.cloud2, className: 'cloud-m' },
        { src: SKY_CLOUDS.cloud1, className: 'cloud-n' },
      ]
    case 'poster':
      return [{ src: SKY_CLOUDS.cloud2, className: 'cloud-o' }]
    default:
      return [{ src: SKY_CLOUDS.cloud1, className: 'cloud-default' }]
  }
})

const decoLines = computed(() => {
  switch (variant.value) {
    case 'cover':
    case 'loading':
      return 'both' as const
    case 'stats':
    case 'manager':
      return 'left' as const
    case 'risk_pie':
    case 'risk_rectification':
    case 'achievement':
      return 'right' as const
    case 'milestone':
    case 'cluster':
    case 'poster':
      return 'none' as const
    default:
      return 'both' as const
  }
})

const showSun = computed(() => {
  return !['milestone', 'cluster', 'poster'].includes(variant.value)
})

const showGlow = computed(() =>
  ['achievement', 'poster', 'loading'].includes(variant.value)
)

const showRays = computed(() =>
  ['achievement', 'cover'].includes(variant.value)
)

const showCosmicLamp = computed(() => variant.value === 'loading')

const journeyIntensity = computed<'hero' | 'ambient'>(() =>
  ['cover', 'loading'].includes(variant.value) ? 'hero' : 'ambient'
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.bill-sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
}

.bill-sky__base {
  position: absolute;
  inset: -4%;
  @include bill-cosmic-background;
  background-size: cover;
  transition: background-position 0.6s ease;
}

.bill-sky__grain {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  mix-blend-mode: overlay;
  @include bill-noise-overlay;
  pointer-events: none;
}

.bill-sky__mesh {
  position: absolute;
  inset: 0;
  background-image: url('@/assets/images/theme-bg-mesh.png');
  background-size: cover;
  background-position: center;
  opacity: 0.28;
  mix-blend-mode: soft-light;
}

.bill-sky__star-dust {
  position: absolute;
  inset: 0;
  opacity: 0.55;
  background-image:
    radial-gradient(1px 1px at 8% 12%, rgba(255, 255, 255, 0.55), transparent),
    radial-gradient(1px 1px at 22% 38%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 35% 8%, rgba(255, 255, 255, 0.35), transparent),
    radial-gradient(1px 1px at 48% 52%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1px 1px at 62% 28%, rgba(255, 255, 255, 0.38), transparent),
    radial-gradient(1px 1px at 74% 64%, rgba(255, 255, 255, 0.42), transparent),
    radial-gradient(1px 1px at 88% 18%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(1px 1px at 15% 72%, rgba(255, 255, 255, 0.32), transparent),
    radial-gradient(1px 1px at 92% 82%, rgba(255, 255, 255, 0.36), transparent),
    radial-gradient(1.5px 1.5px at 55% 78%, rgba(64, 224, 208, 0.45), transparent);
  background-size: 180px 220px;
  animation: starDustDrift 40s linear infinite;
}

.bill-sky__stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 18%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1px 1px at 78% 24%, rgba(255, 255, 255, 0.75), transparent),
    radial-gradient(1.5px 1.5px at 42% 62%, rgba(255, 255, 255, 0.65), transparent),
    radial-gradient(1px 1px at 88% 68%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 24% 82%, rgba(255, 255, 255, 0.55), transparent),
    radial-gradient(2px 2px at 58% 12%, rgba(255, 215, 0, 0.85), transparent),
    radial-gradient(1px 1px at 6% 48%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 32% 44%, rgba(64, 224, 208, 0.7), transparent),
    radial-gradient(1px 1px at 68% 88%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 94% 42%, rgba(255, 215, 0, 0.65), transparent);
  background-size: 100% 100%;
  animation: starTwinkle 5s ease-in-out infinite alternate;
  opacity: 0.9;
}

.bill-sky__wash {
  position: absolute;
  inset: 0;
}

.bill-sky__cloud {
  position: absolute;
  object-fit: contain;
  opacity: 0.55;
  filter: saturate(0.85);
  will-change: transform;
}

.bill-sky__deco {
  position: absolute;
  opacity: 0.2;
  filter: saturate(0.65);
}

.line-left {
  top: 2%;
  left: -20%;
  width: 68%;
  transform: rotate(-2deg);
}

.line-right {
  bottom: 8%;
  right: -28%;
  width: 70%;
  transform: rotate(180deg);
}

.bill-sky__sun {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff8c8, $bill-accent-yellow 55%, $bill-accent-orange 100%);
  box-shadow:
    0 0 40px rgba(255, 215, 0, 0.45),
    0 0 80px rgba(255, 140, 0, 0.2);
}

.bill-sky__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.bill-sky__rays {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 90% 55% at 50% -5%,
    rgba(255, 215, 0, 0.2) 0%,
    rgba(64, 224, 208, 0.08) 45%,
    transparent 68%
  );
}

/* —— 构图：同一底图不同偏移 —— */
.bill-sky--loading .bill-sky__base {
  background-position: center 12%;
  transform: scale(1.06);
}

.bill-sky--cover .bill-sky__base {
  background-position: 42% center;
  transform: scale(1.02);
}

.bill-sky--stats .bill-sky__base {
  background-position: center 22%;
}

.bill-sky--manager .bill-sky__base {
  background-position: 58% center;
}

.bill-sky--risk_pie .bill-sky__base {
  background-position: center 78%;
  transform: scale(1.04);
}

.bill-sky--risk_rectification .bill-sky__base {
  background-position: center 72%;
  transform: scale(1.05);
}

.bill-sky--milestone .bill-sky__base {
  background-position: 40% 35%;
  transform: scale(1.08);
}

.bill-sky--cluster .bill-sky__base {
  background-position: 72% 40%;
}

.bill-sky--achievement .bill-sky__base {
  background-position: center 18%;
  transform: scale(1.05);
}

.bill-sky--poster .bill-sky__base {
  background-position: center 30%;
}

.bill-sky--default .bill-sky__base {
  background-position: center center;
}

/* —— 氛围薄雾（薄荷极光 + 星际光晕） —— */
.bill-sky--loading .bill-sky__wash {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(64, 224, 208, 0.12) 100%
  );
}

.bill-sky--cover .bill-sky__wash {
  background:
    radial-gradient(ellipse 55% 45% at 88% 46%, rgba(255, 230, 120, 0.22), transparent 58%),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(32, 178, 170, 0.1) 100%
    );
}

.bill-sky--stats .bill-sky__wash {
  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(64, 224, 208, 0.14) 55%,
    rgba(4, 31, 36, 0.08) 100%
  );
}

.bill-sky--manager .bill-sky__wash {
  background: linear-gradient(
    120deg,
    rgba(64, 224, 208, 0.16) 0%,
    rgba(255, 255, 255, 0.14) 45%,
    rgba(32, 178, 170, 0.12) 100%
  );
}

.bill-sky--risk_pie .bill-sky__wash {
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 215, 0, 0.1) 35%,
    transparent 70%
  );
}

.bill-sky--risk_rectification .bill-sky__wash {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(64, 224, 208, 0.12) 55%,
    rgba(255, 215, 0, 0.08) 100%
  );
}

.bill-sky--milestone .bill-sky__wash {
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 140, 0, 0.14), transparent 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(32, 178, 170, 0.1) 100%);
}

.bill-sky--cluster .bill-sky__wash {
  background: linear-gradient(
    200deg,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(64, 224, 208, 0.14) 50%,
    rgba(255, 215, 0, 0.08) 100%
  );
}

.bill-sky--achievement .bill-sky__wash {
  background: linear-gradient(
    180deg,
    rgba(255, 215, 0, 0.22) 0%,
    rgba(255, 255, 255, 0.16) 40%,
    rgba(32, 178, 170, 0.1) 100%
  );
}

.bill-sky--poster .bill-sky__wash {
  background: radial-gradient(
    circle at 50% 42%,
    rgba(255, 255, 255, 0.42) 0%,
    rgba(255, 215, 0, 0.14) 45%,
    rgba(64, 224, 208, 0.12) 100%
  );
}

/* —— 太阳位置/大小 —— */
.bill-sky--loading .bill-sky__sun {
  top: 16%;
  right: 12%;
  width: 52px;
  height: 52px;
}

.bill-sky--cover .bill-sky__sun {
  top: 22%;
  right: 16%;
  width: 56px;
  height: 56px;
}

.bill-sky--stats .bill-sky__sun {
  top: 10%;
  left: 10%;
  right: auto;
  width: 42px;
  height: 42px;
  opacity: 0.85;
}

.bill-sky--manager .bill-sky__sun {
  top: 14%;
  right: 8%;
  width: 46px;
  height: 46px;
}

.bill-sky--risk_pie .bill-sky__sun {
  top: 8%;
  right: 20%;
  width: 38px;
  height: 38px;
  opacity: 0.75;
}

.bill-sky--risk_rectification .bill-sky__sun {
  top: 10%;
  right: 14%;
  width: 40px;
  height: 40px;
  opacity: 0.78;
}

.bill-sky--achievement .bill-sky__sun {
  top: 6%;
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  box-shadow:
    0 0 60px rgba(255, 215, 0, 0.5),
    0 0 100px rgba(255, 140, 0, 0.25);
}

.bill-sky--default .bill-sky__sun {
  top: 18%;
  right: 14%;
  width: 48px;
  height: 48px;
}

/* —— 云朵布局 —— */
.cloud-a {
  left: -8%;
  bottom: 18%;
  width: 42%;
  opacity: 0.5;
}

.cloud-b {
  right: -12%;
  top: 28%;
  width: 48%;
  opacity: 0.4;
}

.cloud-c {
  left: -15%;
  bottom: 32%;
  width: 50%;
  opacity: 0.35;
}

.cloud-d {
  left: -10%;
  top: 8%;
  width: 44%;
}

.cloud-e {
  right: -8%;
  bottom: 22%;
  width: 38%;
  opacity: 0.45;
}

.cloud-f {
  right: -18%;
  top: 20%;
  width: 55%;
  opacity: 0.5;
}

.cloud-g {
  right: -6%;
  top: 12%;
  width: 36%;
  opacity: 0.42;
}

.cloud-h {
  left: -12%;
  bottom: 28%;
  width: 46%;
  opacity: 0.38;
}

.cloud-i {
  left: 50%;
  bottom: 8%;
  width: 70%;
  transform: translateX(-50%);
  opacity: 0.25;
}

.cloud-j {
  left: -5%;
  top: 15%;
  width: 32%;
}

.cloud-k {
  right: -8%;
  top: 38%;
  width: 40%;
}

.cloud-l {
  left: 20%;
  bottom: 12%;
  width: 28%;
  opacity: 0.35;
}

.cloud-m {
  right: -10%;
  bottom: 20%;
  width: 45%;
  opacity: 0.48;
}

.cloud-n {
  left: -8%;
  top: 25%;
  width: 35%;
  opacity: 0.4;
}

.cloud-o {
  left: 50%;
  top: 6%;
  width: 65%;
  transform: translateX(-50%);
  opacity: 0.32;
}

.cloud-default {
  right: -10%;
  top: 30%;
  width: 40%;
}

/* —— 光晕 —— */
.bill-sky--loading .bill-sky__glow {
  top: 10%;
  right: 6%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4), transparent 70%);
}

.bill-sky--achievement .bill-sky__glow {
  top: -5%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.42), transparent 68%);
}

.bill-sky--poster .bill-sky__glow {
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.55), transparent 65%);
}

/* —— 轻微漂移动画（激活页） —— */
.bill-sky--animated .bill-sky__mesh {
  animation: cosmicDrift 22s ease-in-out infinite alternate;
}

.bill-sky--animated .bill-sky__star-dust {
  animation-duration: 28s;
  opacity: 0.72;
}

.bill-sky--animated .cloud-a,
.bill-sky--animated .cloud-d,
.bill-sky--animated .cloud-j {
  animation: cloudDriftA 18s ease-in-out infinite;
}

.bill-sky--animated .cloud-b,
.bill-sky--animated .cloud-e,
.bill-sky--animated .cloud-k {
  animation: cloudDriftB 22s ease-in-out infinite;
}

.bill-sky--animated .cloud-m,
.bill-sky--animated .cloud-o {
  animation: cloudDriftC 20s ease-in-out infinite;
}

@keyframes starTwinkle {
  0% {
    opacity: 0.55;
  }
  100% {
    opacity: 0.98;
  }
}

@keyframes starDustDrift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-28px);
  }
}

@keyframes cosmicDrift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-1.5%, -1.2%) scale(1.03);
  }
}

@keyframes cloudDriftA {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(12px);
  }
}

@keyframes cloudDriftB {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-14px);
  }
}

@keyframes cloudDriftC {
  0%,
  100% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(calc(-50% + 10px));
  }
}
</style>
