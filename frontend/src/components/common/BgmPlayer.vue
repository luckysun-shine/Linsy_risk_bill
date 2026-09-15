<template>
  <button
    type="button"
    class="bgm-btn"
    :class="{ playing: isPlaying }"
    :aria-label="isPlaying ? '关闭音乐' : '开启音乐'"
    @click="toggle"
  >
    <span class="disc">
      <span class="disc__center" />
    </span>
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
  min-width: 44px;
  min-height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  background: rgba(4, 31, 56, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 14px rgba(2, 18, 38, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease;

  &:active {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid $bill-accent-yellow;
    outline-offset: 3px;
  }
}

.disc {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    from 0deg,
    $bill-accent-yellow 0%,
    $bill-accent-orange 25%,
    $bill-aurora 50%,
    $bill-link-blue 75%,
    $bill-accent-yellow 100%
  );
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.9),
    0 0 12px rgba(0, 196, 199, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &__center {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #021226;
    border: 1.5px solid #fff;
  }
}

.bgm-btn.playing .disc {
  animation: disc-spin 3.6s linear infinite;
}

@keyframes disc-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bgm-btn.playing .disc {
    animation: none;
    filter: drop-shadow(0 0 4px $bill-accent-yellow);
  }
}
</style>
