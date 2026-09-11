<template>
  <button
    type="button"
    class="bgm-btn"
    :class="{ playing: isPlaying }"
    :aria-label="isPlaying ? '关闭音乐' : '开启音乐'"
    @click="toggle"
  >
    <span class="disc" />
  </button>
  <audio
    v-if="src"
    ref="audioRef"
    :src="src"
    loop
    preload="none"
    playsinline
    webkit-playsinline
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
  }>(),
  { src: '/audio/bgm.mp3' }
)

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
let unlocked = false

const tryPlay = async () => {
  const el = audioRef.value
  if (!el || !props.src) return
  try {
    await el.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

const unlockOnTouch = () => {
  if (unlocked) return
  unlocked = true
  const el = audioRef.value
  if (!el) return
  el.muted = true
  el.play()
    .then(() => {
      el.pause()
      el.currentTime = 0
      el.muted = false
    })
    .catch(() => {})
}

const toggle = async () => {
  const el = audioRef.value
  if (!el || !props.src) return
  if (isPlaying.value) {
    el.pause()
    isPlaying.value = false
  } else {
    await tryPlay()
  }
}

onMounted(() => {
  document.addEventListener('touchstart', unlockOnTouch, { once: true, passive: true })
  document.addEventListener('click', unlockOnTouch, { once: true })
})

onUnmounted(() => {
  document.removeEventListener('touchstart', unlockOnTouch)
  document.removeEventListener('click', unlockOnTouch)
  audioRef.value?.pause()
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.bgm-btn {
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  right: max(12px, env(safe-area-inset-right));
  z-index: 60;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.disc {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, $bill-accent-yellow, $bill-accent-orange, $bill-aurora, $bill-accent-yellow);
  box-shadow:
    inset 0 0 0 4px rgba(255, 255, 255, 0.9),
    0 0 16px rgba(64, 224, 208, 0.35);
  transition: transform 0.2s ease;
}

.bgm-btn.playing .disc {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
