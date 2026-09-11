<template>
  <div
    class="glass-lamp-deco"
    :class="[
      `glass-lamp-deco--${size}`,
      { 'glass-lamp-deco--animated': animated },
    ]"
    aria-hidden="true"
  >
  <div v-if="showFloatStar" class="glass-lamp-deco__float-star">
      <svg viewBox="0 0 64 64" class="soft-star soft-star--float">
        <path
          d="M32 6 C34 22 42 30 58 32 C42 34 34 42 32 58 C30 42 22 34 6 32 C22 30 30 22 32 6 Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div class="glass-lamp-deco__lamp">
      <div class="lamp__halo" />
      <div class="lamp__dome">
        <div class="lamp__shine lamp__shine--left" />
        <div class="lamp__shine lamp__shine--right" />
        <div class="lamp__inner-light" />
        <div class="lamp__pedestal" />
        <svg viewBox="0 0 48 48" class="lamp__inner-star">
          <path
            d="M24 8 L28.5 19 L40 19 L31 26.5 L34.5 38 L24 31 L13.5 38 L17 26.5 L8 19 L19.5 19 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="lamp__cap">
        <span class="lamp__knob" />
      </div>
      <div class="lamp__base">
        <span class="lamp__base-rim" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    animated?: boolean
    size?: 'sm' | 'md' | 'lg'
    showFloatStar?: boolean
  }>(),
  {
    animated: false,
    size: 'md',
    showFloatStar: true,
  }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.glass-lamp-deco {
  position: relative;
  pointer-events: none;
  filter: saturate(0.92) brightness(0.94);
}

.glass-lamp-deco--sm {
  width: 42px;
  height: 54px;
}

.glass-lamp-deco--md {
  width: 58px;
  height: 74px;
}

.glass-lamp-deco--lg {
  width: 78px;
  height: 98px;
}

.soft-star {
  display: block;
  width: 100%;
  height: 100%;
  color: rgba(255, 215, 0, 0.88);
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.45));
}

.glass-lamp-deco__float-star {
  position: absolute;
  top: -18%;
  right: -24%;
  width: 42%;
  height: 42%;
  z-index: 3;
}

.glass-lamp-deco__lamp {
  position: relative;
  width: 100%;
  height: 100%;
}

.lamp__halo {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 120%;
  height: 70%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 224, 208, 0.22), transparent 68%);
  opacity: 0.75;
}

.lamp__dome {
  position: absolute;
  left: 50%;
  top: 8%;
  width: 74%;
  height: 58%;
  transform: translateX(-50%);
  border-radius: 50% 50% 44% 44% / 58% 58% 42% 42%;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.08) 48%, rgba(64, 224, 208, 0.12) 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.52);
  box-shadow:
    inset 0 10px 18px rgba(255, 255, 255, 0.28),
    inset 0 -10px 20px rgba(32, 178, 170, 0.18),
    0 8px 20px rgba(4, 31, 36, 0.18);
  overflow: hidden;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.lamp__shine {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  filter: blur(1px);
}

.lamp__shine--left {
  top: 10%;
  left: 10%;
  width: 18%;
  height: 34%;
  transform: rotate(-18deg);
  opacity: 0.75;
}

.lamp__shine--right {
  top: 18%;
  right: 14%;
  width: 10%;
  height: 18%;
  opacity: 0.45;
}

.lamp__inner-light {
  position: absolute;
  top: 8%;
  left: 50%;
  width: 34%;
  height: 22%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(92, 232, 220, 0.95), rgba(64, 224, 208, 0.35) 58%, transparent 72%);
  box-shadow: 0 0 16px rgba(64, 224, 208, 0.55);
  opacity: 0.82;
}

.lamp__pedestal {
  position: absolute;
  bottom: 14%;
  left: 50%;
  width: 28%;
  height: 10%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(32, 178, 170, 0.55), rgba(10, 92, 88, 0.75));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.lamp__inner-star {
  position: absolute;
  bottom: 18%;
  left: 50%;
  width: 34%;
  height: 34%;
  transform: translateX(-50%);
  color: rgba(255, 210, 90, 0.92);
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5));
}

.lamp__cap {
  position: absolute;
  top: 3%;
  left: 50%;
  width: 22%;
  height: 8%;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(180deg, $bill-aurora, $bill-mint);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  z-index: 2;
}

.lamp__knob {
  position: absolute;
  top: -55%;
  left: 50%;
  width: 42%;
  height: 90%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #5ce8dc, $bill-brand-deep);
  box-shadow: 0 2px 4px rgba(4, 31, 36, 0.25);
}

.lamp__base {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 86%;
  height: 24%;
  transform: translateX(-50%);
  border-radius: 10px 10px 14px 14px;
  background: linear-gradient(180deg, #4ad9cf 0%, $bill-mint 38%, $bill-brand 100%);
  box-shadow:
    0 5px 0 rgba(4, 31, 36, 0.22),
    inset 0 2px 0 rgba(255, 255, 255, 0.38),
    inset 0 -4px 8px rgba(4, 31, 36, 0.12);
}

.lamp__base-rim {
  position: absolute;
  inset: 3px 5px auto;
  height: 28%;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent);
}

.glass-lamp-deco--animated {
  .glass-lamp-deco__lamp {
    animation: lampFloat 5.5s ease-in-out infinite;
  }

  .glass-lamp-deco__float-star {
    animation: floatStarBob 4.2s ease-in-out infinite;
  }

  .lamp__inner-light {
    animation: innerGlowPulse 3.6s ease-in-out infinite;
  }

  .soft-star--float {
    animation: starGlowPulse 3s ease-in-out infinite;
  }
}

@keyframes lampFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes floatStarBob {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(3px, -7px) rotate(6deg);
  }
}

@keyframes innerGlowPulse {
  0%,
  100% {
    opacity: 0.68;
    transform: translateX(-50%) scale(0.95);
  }
  50% {
    opacity: 0.92;
    transform: translateX(-50%) scale(1.05);
  }
}

@keyframes starGlowPulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 14px rgba(255, 215, 0, 0.65));
  }
}

@media (prefers-reduced-motion: reduce) {
  .glass-lamp-deco--animated * {
    animation: none !important;
  }
}
</style>
