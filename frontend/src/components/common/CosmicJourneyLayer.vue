<template>
  <div
    class="cosmic-journey"
    :class="[
      `cosmic-journey--${intensity}`,
      { 'cosmic-journey--animated': animated },
    ]"
    aria-hidden="true"
  >
    <svg class="cosmic-journey__defs" aria-hidden="true">
      <defs>
        <linearGradient id="ribbonMint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(32, 178, 170, 0.72)" />
          <stop offset="55%" stop-color="rgba(64, 224, 208, 0.55)" />
          <stop offset="100%" stop-color="rgba(10, 61, 66, 0.35)" />
        </linearGradient>
        <linearGradient id="ribbonGold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255, 215, 0, 0.18)" />
          <stop offset="100%" stop-color="rgba(64, 224, 208, 0.28)" />
        </linearGradient>
        <filter id="ribbonGrain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <radialGradient id="portalCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffef0" />
          <stop offset="28%" stop-color="#ffe566" />
          <stop offset="58%" stop-color="#40e0d0" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
    </svg>

    <div class="cosmic-journey__ribbons">
      <svg class="ribbon ribbon--top" viewBox="0 0 400 90" preserveAspectRatio="none">
        <path
          d="M0,72 C80,18 160,58 240,34 C300,16 350,42 400,28 L400,0 L0,0 Z"
          fill="url(#ribbonMint)"
          filter="url(#ribbonGrain)"
        />
        <path
          d="M0,58 C120,8 220,48 320,22 C360,12 385,30 400,24 L400,0 L0,0 Z"
          fill="url(#ribbonGold)"
          opacity="0.45"
        />
      </svg>
      <svg class="ribbon ribbon--bottom" viewBox="0 0 400 90" preserveAspectRatio="none">
        <path
          d="M0,18 C90,62 180,8 280,38 C340,56 370,28 400,44 L400,90 L0,90 Z"
          fill="url(#ribbonMint)"
          filter="url(#ribbonGrain)"
        />
        <path
          d="M0,32 C100,78 200,22 300,52 C350,66 378,40 400,56 L400,90 L0,90 Z"
          fill="url(#ribbonGold)"
          opacity="0.38"
        />
      </svg>
    </div>

    <div class="cosmic-journey__streaks">
      <span
        v-for="streak in streaks"
        :key="`streak-${streak.id}`"
        class="journey-streak"
        :class="`journey-streak--${streak.tone}`"
        :style="streakStyle(streak)"
      />
    </div>

    <div class="cosmic-journey__portal">
      <span
        v-for="ring in portalRings"
        :key="`ring-${ring.id}`"
        class="portal-ring"
        :style="ringStyle(ring)"
      />
      <div class="portal-core" />
      <div class="portal-flare" />
    </div>

    <div class="cosmic-journey__orbs">
      <span
        v-for="orb in orbs"
        :key="`orb-${orb.id}`"
        class="journey-orb"
        :class="`journey-orb--${orb.tone}`"
        :style="orbStyle(orb)"
      />
    </div>

    <div class="cosmic-journey__sparkles">
      <span
        v-for="spark in sparkles"
        :key="`spark-${spark.id}`"
        class="journey-sparkle"
        :style="sparkleStyle(spark)"
      />
    </div>

    <div class="cosmic-journey__grain" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  COSMIC_JOURNEY_ORBS,
  COSMIC_JOURNEY_SPARKLES,
  COSMIC_JOURNEY_STREAKS,
  type CosmicJourneyOrb,
  type CosmicJourneySparkle,
  type CosmicJourneyStreak,
} from '@/constants/cosmicJourney'

const props = withDefaults(
  defineProps<{
    animated?: boolean
    intensity?: 'hero' | 'ambient'
  }>(),
  {
    animated: false,
    intensity: 'ambient',
  }
)

const portalRings = [
  { id: 0, scale: 1, opacity: 0.35, duration: 18 },
  { id: 1, scale: 0.82, opacity: 0.48, duration: 14 },
  { id: 2, scale: 0.64, opacity: 0.58, duration: 11 },
  { id: 3, scale: 0.46, opacity: 0.68, duration: 9 },
  { id: 4, scale: 0.28, opacity: 0.78, duration: 7 },
]

const streaks = computed(() =>
  props.intensity === 'hero'
    ? COSMIC_JOURNEY_STREAKS
    : COSMIC_JOURNEY_STREAKS.filter((s) => s.id % 2 === 0)
)

const orbs = computed(() =>
  props.intensity === 'hero'
    ? COSMIC_JOURNEY_ORBS
    : COSMIC_JOURNEY_ORBS.filter((o) => o.layer !== 'back')
)

const sparkles = computed(() =>
  props.intensity === 'hero'
    ? COSMIC_JOURNEY_SPARKLES
    : COSMIC_JOURNEY_SPARKLES.slice(0, 8)
)

function streakStyle(streak: CosmicJourneyStreak) {
  return {
    top: `${streak.y}%`,
    width: `${streak.width}%`,
    height: `${streak.height}px`,
    animationDelay: `${streak.delay}s`,
    animationDuration: `${streak.duration}s`,
    opacity: streak.opacity,
  }
}

function ringStyle(ring: (typeof portalRings)[number]) {
  return {
    '--ring-scale': ring.scale,
    '--ring-opacity': ring.opacity,
    animationDuration: `${ring.duration}s`,
  }
}

function orbStyle(orb: CosmicJourneyOrb) {
  return {
    left: `${orb.x}%`,
    top: `${orb.y}%`,
    width: `${orb.size}px`,
    height: `${orb.size}px`,
    animationDelay: `${orb.delay}s`,
    opacity: orb.opacity,
  }
}

function sparkleStyle(spark: CosmicJourneySparkle) {
  return {
    left: `${spark.x}%`,
    top: `${spark.y}%`,
    width: `${spark.size}px`,
    height: `${spark.size}px`,
    animationDelay: `${spark.delay}s`,
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.cosmic-journey {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.cosmic-journey__defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.cosmic-journey__ribbons {
  position: absolute;
  inset: 0;
}

.ribbon {
  position: absolute;
  left: -4%;
  width: 108%;
  opacity: 0.18;

  &--top {
    top: -2%;
    height: 22%;
  }

  &--bottom {
    bottom: -2%;
    height: 24%;
  }
}

.cosmic-journey--ambient {
  .ribbon {
    opacity: 0.1;

    &--top {
      height: 14%;
    }

    &--bottom {
      height: 16%;
    }
  }
}

.cosmic-journey__streaks {
  position: absolute;
  inset: 0;
}

.journey-streak {
  position: absolute;
  left: -40%;
  border-radius: 999px;
  transform-origin: left center;
  opacity: 0;
  filter: blur(0.4px);

  &--teal {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(64, 224, 208, 0.08) 18%,
      rgba(64, 224, 208, 0.55) 55%,
      rgba(255, 255, 255, 0.35) 78%,
      transparent 100%
    );
  }

  &--gold {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 215, 0, 0.06) 12%,
      rgba(255, 215, 0, 0.72) 48%,
      rgba(255, 255, 255, 0.65) 72%,
      transparent 100%
    );
    filter: blur(0.6px);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.35);
  }

  &--mint {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(32, 178, 170, 0.15) 30%,
      rgba(92, 232, 220, 0.45) 60%,
      transparent 100%
    );
  }
}

.cosmic-journey__portal {
  position: absolute;
  right: -14%;
  top: 34%;
  width: min(62vw, 280px);
  height: min(62vw, 280px);
  transform: translateY(-50%);
}

.cosmic-journey--ambient .cosmic-journey__portal {
  right: -22%;
  top: 18%;
  width: min(42vw, 180px);
  height: min(42vw, 180px);
  opacity: 0.32;
}

.portal-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 230, 120, 0.42);
  transform: scale(var(--ring-scale));
  opacity: var(--ring-opacity);
  box-shadow:
    0 0 18px rgba(255, 215, 0, 0.12),
    inset 0 0 24px rgba(64, 224, 208, 0.08);

  &:nth-child(odd) {
    border-color: rgba(64, 224, 208, 0.38);
  }

  &:nth-child(3) {
    border-style: dashed;
    border-width: 1.5px;
  }
}

.portal-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 38%;
  height: 38%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, #fffef5 0%, #ffe566 32%, #40e0d0 68%, transparent 100%);
  box-shadow:
    0 0 40px rgba(255, 215, 0, 0.55),
    0 0 80px rgba(64, 224, 208, 0.35);
}

.portal-flare {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, transparent 62%);
}

.cosmic-journey__orbs {
  position: absolute;
  inset: 0;
}

.journey-orb {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  &--glass {
    background: radial-gradient(
      circle at 32% 28%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.12) 42%,
      rgba(64, 224, 208, 0.18) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.38);
    box-shadow:
      inset 0 4px 12px rgba(255, 255, 255, 0.25),
      0 8px 24px rgba(4, 31, 36, 0.12);
  }

  &--mint {
    background: radial-gradient(circle, rgba(92, 232, 220, 0.55), rgba(32, 178, 170, 0.15));
    filter: blur(1px);
  }

  &--gold {
    background: radial-gradient(circle, rgba(255, 230, 120, 0.45), rgba(255, 140, 0, 0.08));
    filter: blur(1.5px);
  }

  &--blur {
    background: radial-gradient(circle, rgba(64, 224, 208, 0.22), transparent 70%);
    filter: blur(8px);
  }
}

.journey-sparkle {
  position: absolute;
  transform: translate(-50%, -50%);

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.85);
  }

  &::before {
    width: 100%;
    height: 22%;
    transform: translate(-50%, -50%);
  }

  &::after {
    width: 22%;
    height: 100%;
    transform: translate(-50%, -50%);
  }
}

.cosmic-journey__grain {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  mix-blend-mode: overlay;
  @include bill-noise-overlay;
}

.cosmic-journey--animated {
  .journey-streak {
    animation: streakWarp linear infinite;
  }

  .portal-ring {
    animation: portalSpin linear infinite;
  }

  .portal-core {
    animation: portalPulse 4s ease-in-out infinite;
  }

  .portal-flare {
    animation: portalFlare 5s ease-in-out infinite alternate;
  }

  .journey-orb {
    animation: orbFloat 7s ease-in-out infinite;
  }

  .journey-sparkle {
    animation: sparkleTwinkle 3.5s ease-in-out infinite;
  }

  .ribbon--top {
    animation: ribbonDriftTop 14s ease-in-out infinite alternate;
  }

  .ribbon--bottom {
    animation: ribbonDriftBottom 16s ease-in-out infinite alternate;
  }
}

.cosmic-journey:not(.cosmic-journey--animated) {
  .journey-streak,
  .portal-ring,
  .journey-orb,
  .journey-sparkle,
  .ribbon--top,
  .ribbon--bottom {
    animation: none !important;
  }

  .journey-streak {
    opacity: 0.22;
    transform: translateX(35vw) scaleX(0.85);
  }
}

@keyframes streakWarp {
  0% {
    opacity: 0;
    transform: translateX(-30vw) scaleX(0.6);
  }
  12% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(115vw) scaleX(1.05);
  }
}

@keyframes portalSpin {
  0% {
    transform: scale(var(--ring-scale)) rotate(0deg);
  }
  100% {
    transform: scale(var(--ring-scale)) rotate(360deg);
  }
}

@keyframes portalPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.92);
    opacity: 0.85;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
    opacity: 1;
  }
}

@keyframes portalFlare {
  0% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    opacity: 0.65;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@keyframes orbFloat {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@keyframes sparkleTwinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@keyframes ribbonDriftTop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-3%);
  }
}

@keyframes ribbonDriftBottom {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(2.5%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-journey--animated * {
    animation: none !important;
  }

  .journey-streak {
    opacity: 0.2 !important;
  }
}
</style>
