<template>
  <div v-if="visible" class="swipe-hint" aria-hidden="true">
    <div class="arrow-wrap">
      <span class="arrow" />
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
.swipe-hint {
  position: fixed;
  left: 50%;
  bottom: max(18px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 50;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.arrow-wrap {
  position: relative;
  width: 28px;
  height: 36px;
}

.arrow {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 14px;
  height: 14px;
  border-left: 3px solid rgba(255, 215, 0, 0.95);
  border-top: 3px solid rgba(255, 215, 0, 0.95);
  transform: translateX(-50%) rotate(45deg);
  animation: swipe-bounce 1.6s ease-in-out infinite;
  opacity: 0.85;
}

.arrow-2 {
  bottom: 10px;
  animation-delay: 0.25s;
  opacity: 0.45;
}

.hint-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 8px rgba(4, 31, 36, 0.35);
  letter-spacing: 1px;
}

@keyframes swipe-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0) rotate(45deg);
    opacity: 0.35;
  }
  50% {
    transform: translateX(-50%) translateY(-8px) rotate(45deg);
    opacity: 1;
  }
}
</style>
