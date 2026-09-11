<template>
  <div v-show="isLandscape" class="landscape-tip">
    <div class="panel">
      <div class="phone-icon" />
      <p>请竖屏浏览以获得最佳体验</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isLandscape = ref(false)

const check = () => {
  isLandscape.value = window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches
}

onMounted(() => {
  check()
  window.addEventListener('resize', check)
  window.addEventListener('orientationchange', check)
})

onUnmounted(() => {
  window.removeEventListener('resize', check)
  window.removeEventListener('orientationchange', check)
})
</script>

<style lang="scss" scoped>
.landscape-tip {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(5, 26, 39, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.panel {
  text-align: center;
  color: #fff;
  font-size: 1.05rem;
  line-height: 1.6;
}

.phone-icon {
  width: 48px;
  height: 80px;
  margin: 0 auto 16px;
  border: 3px solid #fff;
  border-radius: 10px;
  position: relative;
  animation: rotate-phone 2s ease-in-out infinite;
}

.phone-icon::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: #fff;
}

@keyframes rotate-phone {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-90deg);
  }
}
</style>
