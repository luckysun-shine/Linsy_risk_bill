<template>
  <div v-if="visible" class="swipe-hint" aria-hidden="true">
    <div class="arrow-wrap">
      <span class="arrow arrow-1" />
      <span class="arrow arrow-2" />
    </div>
    <p class="hint-text">{{ onCover ? '上滑开启账单' : '上滑查看更多' }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    visible?: boolean
    onCover?: boolean
  }>(),
  { visible: true, onCover: false }
)
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.swipe-hint {
  position: fixed;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 50;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.arrow-wrap {
  position: relative;
  width: 24px;
  height: 28px;
}

.arrow {
  position: absolute;
  left: 50%;
  width: 12px;
  height: 12px;
  border-left: 2.5px solid $bill-accent-yellow;
  border-top: 2.5px solid $bill-accent-yellow;
  transform: translateX(-50%) rotate(45deg);
  animation: swipe-bounce 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
}

.arrow-1 {
  bottom: 0;
  opacity: 0.9;
}

.arrow-2 {
  bottom: 8px;
  border-color: $bill-aurora;
  filter: drop-shadow(0 0 4px rgba(34, 228, 224, 0.5));
  animation-delay: 0.2s;
  opacity: 0.6;
}

.hint-text {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 8px rgba(2, 18, 38, 0.7);
  letter-spacing: 1.5px;
  white-space: nowrap;
}

@keyframes swipe-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0) rotate(45deg);
    opacity: 0.35;
  }
  50% {
    transform: translateX(-50%) translateY(-6px) rotate(45deg);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arrow {
    animation: none;
    transform: translateX(-50%) translateY(-2px) rotate(45deg);
  }
}
</style>
