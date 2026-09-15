<template>
  <div class="slide-loading">
    <BillSkyBackground variant="loading" :animated="true" />

    <div class="slide-loading__body">
      <div class="logo-pulse">LINSY 林氏</div>
      <PageRibbon class="ribbon">2025 风控年度账单</PageRibbon>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: `${progress}%` }" />
      </div>
      <p class="percent">{{ progress }}%</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else class="hint">正在为你准备专属账单…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBillStore } from '@/stores/billStore'
import PageRibbon from '@/components/common/PageRibbon.vue'
import BillSkyBackground from '@/components/common/BillSkyBackground.vue'

defineProps<{
  error?: string | null
}>()

const { loadingProgress: progress } = storeToRefs(useBillStore())
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-loading {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
}

.slide-loading__body {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.logo-pulse {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  animation: pulse 1.4s ease-in-out infinite;
  text-shadow: 0 2px 12px rgba(4, 31, 36, 0.35);
}

.ribbon {
  margin-top: 20px;
  font-size: clamp(1rem, 3.8vw, 1.25rem) !important;
}

.progress-track {
  width: min(280px, 70vw);
  height: 8px;
  margin-top: 36px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(8px);
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, $bill-accent-yellow, $bill-accent-orange, $bill-aurora);
  transition: width 0.25s ease;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.45);
}

.percent {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 1px 8px rgba(4, 31, 36, 0.35);
}

.hint {
  margin-top: 6px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.9;
}

.error {
  margin-top: 12px;
  padding: 0 16px;
  font-size: 0.88rem;
  color: #ffe0e0;
  text-align: center;
  line-height: 1.5;
}

.ip-char {
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 3;
  width: min(140px, 34vw);
  transform: translateX(calc(-50% - 64px));
  filter: drop-shadow(0 8px 12px rgba(8, 66, 93, 0.12));
  animation: float 2.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(calc(-50% - 64px)) translateY(0);
  }
  50% {
    transform: translateX(calc(-50% - 64px)) translateY(-8px);
  }
}
</style>
