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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  overscroll-behavior-y: none;
  overscroll-behavior-x: none;
}

html,
body {
  position: fixed;
  inset: 0;
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
}

#app,
.app-container {
  touch-action: pan-y;
}

/* 页内滚动容器：阻断橡皮筋；允许横竖滑动（表格横滑需要） */
[data-bill-scroll] {
  overscroll-behavior: contain;
  overscroll-behavior-y: contain;
  touch-action: pan-x pan-y;
}

:root {
  --bill-mint: #{$bill-mint};
  --bill-aurora: #{$bill-aurora};
  --bill-accent-yellow: #{$bill-accent-yellow};
  --bill-accent-orange: #{$bill-accent-orange};
  --bill-brand-deep: #{$bill-brand-deep};
  --bill-brand-dark: #{$bill-brand-dark};
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: $bill-brand-dark;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
