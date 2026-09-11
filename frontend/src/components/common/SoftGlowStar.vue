<template>
  <svg
    class="soft-glow-star"
    :class="[
      `soft-glow-star--${variant}`,
      { 'soft-glow-star--animated': animated },
    ]"
    viewBox="0 0 64 64"
    aria-hidden="true"
  >
    <path
      d="M32 6 C34 22 42 30 58 32 C42 34 34 42 32 58 C30 42 22 34 6 32 C22 30 30 22 32 6 Z"
      fill="currentColor"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'gold' | 'cyan' | 'soft'
    animated?: boolean
  }>(),
  {
    variant: 'gold',
    animated: false,
  }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.soft-glow-star {
  display: block;
  width: 100%;
  height: 100%;
}

.soft-glow-star--gold {
  color: rgba(255, 215, 0, 0.82);
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.42));
}

.soft-glow-star--cyan {
  color: rgba(92, 232, 220, 0.78);
  filter: drop-shadow(0 0 10px rgba(64, 224, 208, 0.38));
}

.soft-glow-star--soft {
  color: rgba(255, 255, 255, 0.72);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.35));
}

.soft-glow-star--animated {
  animation: softStarPulse 4s ease-in-out infinite;
}

@keyframes softStarPulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.72;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .soft-glow-star--animated {
    animation: none;
  }
}
</style>
