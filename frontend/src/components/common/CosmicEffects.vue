<template>
  <div
    class="cosmic-effects"
    :class="{ 'cosmic-effects--animated': animated }"
    aria-hidden="true"
  >
    <div class="cosmic-effects__nebulae">
      <div
        v-for="neb in scene.nebulae"
        :key="`neb-${neb.id}`"
        class="cosmic-nebula"
        :class="`cosmic-nebula--${neb.tone}`"
        :style="nebulaStyle(neb)"
      />
    </div>

    <svg class="cosmic-effects__constellation" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line
        v-for="(line, index) in scene.constellation"
        :key="`const-${index}`"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        class="cosmic-constellation-line"
      />
    </svg>

    <div class="cosmic-effects__starfield">
      <span
        v-for="star in scene.stars"
        :key="`star-${star.id}`"
        class="cosmic-star"
        :class="[
          `cosmic-star--layer-${star.layer}`,
          `cosmic-star--${star.tone}`,
        ]"
        :style="starStyle(star)"
      />
    </div>

    <div class="cosmic-effects__particles">
      <span
        v-for="p in scene.particles"
        :key="`particle-${p.id}`"
        class="cosmic-particle"
        :style="particleStyle(p)"
      />
    </div>

    <div class="cosmic-effects__warp">
      <span
        v-for="trail in scene.warpTrails"
        :key="`warp-${trail.id}`"
        class="cosmic-warp"
        :style="warpStyle(trail)"
      />
    </div>

    <div class="cosmic-effects__meteors">
      <span
        v-for="meteor in scene.meteors"
        :key="`meteor-${meteor.id}`"
        class="cosmic-meteor"
        :style="meteorStyle(meteor)"
      >
        <i class="cosmic-meteor__head" />
        <i class="cosmic-meteor__tail" />
      </span>
    </div>

    <div class="cosmic-effects__energy">
      <span
        v-for="bolt in energyBolts"
        :key="`bolt-${bolt.id}`"
        class="cosmic-energy-bolt"
        :style="energyBoltStyle(bolt)"
      />
    </div>

    <div class="cosmic-effects__aurora" />
    <div class="cosmic-effects__speed-ring" />

    <div class="cosmic-effects__deco-stars">
      <SoftGlowStar
        v-for="deco in decoStars"
        :key="`deco-star-${deco.id}`"
        class="cosmic-deco-star"
        :class="`cosmic-deco-star--${deco.id}`"
        :variant="deco.variant"
        :animated="animated"
        :style="decoStarStyle(deco)"
      />
    </div>

    <GlassLampDeco
      v-if="showLamp"
      class="cosmic-effects__lamp"
      size="sm"
      :animated="animated"
      :show-float-star="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  COSMIC_SCENE,
  COSMIC_ENERGY_BOLTS,
  type CosmicEnergyBolt,
  type CosmicMeteor,
  type CosmicNebula,
  type CosmicParticle,
  type CosmicStar,
  type CosmicWarpTrail,
} from '@/constants/cosmicEffects'
import GlassLampDeco from '@/components/common/GlassLampDeco.vue'
import SoftGlowStar from '@/components/common/SoftGlowStar.vue'

const props = withDefaults(
  defineProps<{
    animated?: boolean
    showLamp?: boolean
    intensity?: 'hero' | 'ambient'
  }>(),
  {
    animated: false,
    showLamp: false,
    intensity: 'ambient',
  }
)

const scene = COSMIC_SCENE

const energyBolts = computed(() =>
  props.intensity === 'hero' ? COSMIC_ENERGY_BOLTS : COSMIC_ENERGY_BOLTS.slice(0, 4)
)

const decoStars = [
  { id: 'a', x: 10, y: 20, size: 18, variant: 'soft' as const },
  { id: 'b', x: 78, y: 32, size: 28, variant: 'gold' as const },
  { id: 'c', x: 86, y: 48, size: 20, variant: 'gold' as const },
  { id: 'd', x: 72, y: 58, size: 14, variant: 'cyan' as const },
  { id: 'e', x: 18, y: 72, size: 16, variant: 'soft' as const },
]

function decoStarStyle(deco: (typeof decoStars)[number]) {
  return {
    left: `${deco.x}%`,
    top: `${deco.y}%`,
    width: `${deco.size}px`,
    height: `${deco.size}px`,
  }
}

function starStyle(star: CosmicStar) {
  return {
    left: `${star.x}%`,
    top: `${star.y}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    animationDelay: `${star.delay}s`,
  }
}

function particleStyle(p: CosmicParticle) {
  return {
    left: `${p.x}%`,
    top: `${p.y}%`,
    width: `${p.size}px`,
    height: `${p.size}px`,
    '--drift-x': `${p.driftX}px`,
    animationDelay: `${p.delay}s`,
    animationDuration: `${p.duration}s`,
  }
}

function warpStyle(trail: CosmicWarpTrail) {
  return {
    left: `${trail.x}%`,
    height: `${trail.height}px`,
    opacity: trail.opacity,
    animationDelay: `${trail.delay}s`,
    animationDuration: `${trail.duration}s`,
  }
}

function meteorStyle(meteor: CosmicMeteor) {
  return {
    left: `${meteor.x}%`,
    top: `${meteor.y}%`,
    '--meteor-angle': `${meteor.angle}deg`,
    '--meteor-length': `${meteor.length}px`,
    animationDelay: `${meteor.delay}s`,
    animationDuration: `${meteor.duration}s`,
  }
}

function nebulaStyle(neb: CosmicNebula) {
  return {
    left: `${neb.x}%`,
    top: `${neb.y}%`,
    width: `${neb.size}%`,
    height: `${neb.size}%`,
    animationDelay: `${neb.delay}s`,
  }
}

function energyBoltStyle(bolt: CosmicEnergyBolt) {
  return {
    top: `${bolt.y}%`,
    width: `${bolt.width}%`,
    height: `${bolt.height}px`,
    animationDelay: `${bolt.delay}s`,
    animationDuration: `${bolt.duration}s`,
    opacity: bolt.opacity,
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.cosmic-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.cosmic-effects__nebulae,
.cosmic-effects__starfield,
.cosmic-effects__particles,
.cosmic-effects__warp,
.cosmic-effects__meteors {
  position: absolute;
  inset: 0;
}

.cosmic-nebula {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(28px);
  opacity: 0.35;
  animation: nebulaPulse 12s ease-in-out infinite alternate;
}

.cosmic-nebula--mint {
  background: radial-gradient(circle, rgba(64, 224, 208, 0.55), transparent 68%);
}

.cosmic-nebula--gold {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.35), transparent 70%);
}

.cosmic-nebula--violet {
  background: radial-gradient(circle, rgba(120, 90, 255, 0.28), transparent 72%);
}

.cosmic-effects__constellation {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.22;
}

.cosmic-constellation-line {
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 0.12;
  stroke-dasharray: 1.2 1.8;
}

.cosmic-star {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: starPulse 4.5s ease-in-out infinite;
}

.cosmic-star--white {
  background: #fff;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

.cosmic-star--gold {
  background: $bill-accent-yellow;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.75);
}

.cosmic-star--cyan {
  background: $bill-aurora;
  box-shadow: 0 0 6px rgba(64, 224, 208, 0.8);
}

.cosmic-star--layer-1 {
  opacity: 0.45;
}

.cosmic-star--layer-2 {
  opacity: 0.72;
  animation-duration: 3.8s;
}

.cosmic-star--layer-3 {
  opacity: 0.95;
  animation-duration: 3.2s;
}

.cosmic-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 6px rgba(64, 224, 208, 0.45);
  opacity: 0;
  animation: particleFloat 8s ease-in-out infinite;
}

.cosmic-warp {
  position: absolute;
  top: -20%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(64, 224, 208, 0.05) 18%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(64, 224, 208, 0.08) 82%,
    transparent 100%
  );
  opacity: 0;
  filter: blur(0.3px);
}

.cosmic-meteor {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  transform: rotate(var(--meteor-angle));
  animation: meteorShoot 4.5s linear infinite;
}

.cosmic-meteor__head {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 8px #fff,
    0 0 14px rgba(64, 224, 208, 0.9);
}

.cosmic-meteor__tail {
  position: absolute;
  top: 1px;
  right: 0;
  width: var(--meteor-length);
  height: 2px;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(64, 224, 208, 0.15) 20%,
    rgba(255, 255, 255, 0.85) 72%,
    #fff 100%
  );
  border-radius: 2px;
  filter: blur(0.4px);
}

.cosmic-effects__energy {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.cosmic-energy-bolt {
  position: absolute;
  left: -35%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.12) 20%,
    rgba(255, 230, 120, 0.85) 55%,
    rgba(255, 255, 255, 0.5) 75%,
    transparent 100%
  );
  filter: blur(0.5px);
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.35);
  opacity: 0;
}

.cosmic-effects__aurora {
  position: absolute;
  inset: -10% -20%;
  background:
    conic-gradient(
      from 210deg at 50% 120%,
      transparent 0deg,
      rgba(64, 224, 208, 0.12) 40deg,
      rgba(255, 215, 0, 0.08) 80deg,
      transparent 140deg
    );
  opacity: 0.55;
  animation: auroraSweep 16s ease-in-out infinite alternate;
}

.cosmic-effects__speed-ring {
  position: absolute;
  right: -8%;
  top: 38%;
  left: auto;
  width: min(58vw, 260px);
  height: min(58vw, 260px);
  transform: translateY(-50%);
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.1);
  box-shadow:
    0 0 40px rgba(255, 215, 0, 0.08),
    inset 0 0 60px rgba(64, 224, 208, 0.06);
  opacity: 0.45;
}

.cosmic-effects__deco-stars {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.cosmic-deco-star {
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0.7;
}

.cosmic-effects__lamp {
  position: absolute;
  right: 5%;
  bottom: 18%;
  opacity: 0.55;
  z-index: 2;
}

.cosmic-effects--animated {
  .cosmic-warp {
    animation: warpStreak 2.4s linear infinite;
  }

  .cosmic-energy-bolt {
    animation: energyBoltFly 2.6s linear infinite;
  }

  .cosmic-meteor {
    animation-name: meteorShoot;
  }

  .cosmic-effects__speed-ring {
    animation: speedRingPulse 6s ease-in-out infinite;
  }

  .cosmic-effects__aurora {
    animation: auroraSweep 10s ease-in-out infinite alternate;
  }
}

.cosmic-effects:not(.cosmic-effects--animated) {
  .cosmic-warp,
  .cosmic-meteor,
  .cosmic-energy-bolt,
  .cosmic-particle,
  .cosmic-star,
  .cosmic-nebula,
  .cosmic-effects__speed-ring,
  .cosmic-effects__aurora {
    animation: none !important;
    animation-play-state: paused !important;
  }

  .cosmic-warp,
  .cosmic-meteor,
  .cosmic-energy-bolt {
    opacity: 0;
  }

  .cosmic-particle {
    opacity: 0.28;
  }
}

@keyframes starPulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.85);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

@keyframes nebulaPulse {
  0% {
    opacity: 0.22;
    transform: translate(-50%, -50%) scale(0.92);
  }
  100% {
    opacity: 0.42;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translate(0, 12px) scale(0.6);
  }
  15% {
    opacity: 0.85;
  }
  50% {
    opacity: 0.55;
    transform: translate(var(--drift-x), -28px) scale(1);
  }
  85% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
    transform: translate(calc(var(--drift-x) * 1.2), -56px) scale(0.5);
  }
}

@keyframes energyBoltFly {
  0% {
    opacity: 0;
    transform: translateX(-20vw) scaleX(0.5);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(120vw) scaleX(1.1);
  }
}

@keyframes warpStreak {
  0% {
    opacity: 0;
    transform: translate(-50%, -120%) scaleY(0.4);
  }
  12% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 130vh) scaleY(1.15);
  }
}

@keyframes meteorShoot {
  0% {
    opacity: 0;
    transform: rotate(var(--meteor-angle)) translateX(0);
  }
  8% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--meteor-angle)) translateX(42vw) translateY(28vh);
  }
}

@keyframes auroraSweep {
  0% {
    opacity: 0.35;
    transform: translateX(-4%) rotate(-2deg);
  }
  100% {
    opacity: 0.65;
    transform: translateX(4%) rotate(2deg);
  }
}

@keyframes speedRingPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(-50%) scale(0.96);
  }
  50% {
    opacity: 0.58;
    transform: translateY(-50%) scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-effects * {
    animation: none !important;
  }

  .cosmic-particle,
  .cosmic-warp,
  .cosmic-meteor {
    opacity: 0 !important;
  }

  .cosmic-star {
    opacity: 0.7 !important;
  }
}
</style>
