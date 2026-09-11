import { onMounted, onUnmounted, ref } from 'vue'

/** 手机竖屏或窄屏：图表需压缩为一屏完整展示 */
export function useNarrowViewport(maxWidth = 480) {
  const isNarrow = ref(
    typeof window !== 'undefined' ? window.innerWidth <= maxWidth : false
  )

  const update = () => {
    if (typeof window === 'undefined') return
    isNarrow.value = window.innerWidth <= maxWidth
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isNarrow }
}
