<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@use '@/styles/bill-theme.scss' as *;

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  // 1. Typography Tokens (1.25 Modular Scale)
  --text-2xs: 0.625rem;  /* 10px */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.375rem;   /* 22px */
  --text-2xl: 1.75rem;   /* 28px */
  --text-3xl: 2.25rem;   /* 36px */

  // 2. Spacing Tokens (8px Base Scale)
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  // 3. Color Tokens
  --bill-mint: #{$bill-mint};
  --bill-aurora: #{$bill-aurora};
  --bill-accent-yellow: #{$bill-accent-yellow};
  --bill-accent-orange: #{$bill-accent-orange};
  --bill-brand-deep: #{$bill-brand-deep};
  --bill-brand-dark: #{$bill-brand-dark};
  --bill-space-deep: #{$bill-space-deep};

  // 4. Motion Tokens
  --ease-out: #{$ease-out-quint};
  --duration-fast: #{$duration-fast};
  --duration-normal: #{$duration-normal};
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  background-color: $bill-space-deep;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  position: fixed;
  inset: 0;
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

#app,
.app-container {
  touch-action: pan-y;
}

/* 页内滚动容器：阻断橡皮筋；平滑惯性滚动 */
[data-bill-scroll] {
  overscroll-behavior: contain;
  overscroll-behavior-y: contain;
  touch-action: pan-x pan-y;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(9, 89, 115, 0.28);
    border-radius: 999px;

    &:hover {
      background: rgba(9, 89, 115, 0.45);
    }
  }
}

/* 可访问性交互焦点 */
:focus-visible {
  outline: 2px solid $bill-accent-yellow;
  outline-offset: 2px;
}

button:focus:not(:focus-visible),
a:focus:not(:focus-visible) {
  outline: none;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: $bill-brand-dark;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 动效减弱模式：尊重系统用户设置 (WCAG 2.3.3) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
