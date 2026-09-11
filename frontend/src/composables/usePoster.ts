import html2canvas from 'html2canvas'
import { ref } from 'vue'

export function usePoster() {
  const posterDataUrl = ref<string | null>(null)
  const generating = ref(false)
  const error = ref<string | null>(null)

  async function generateFromElement(el: HTMLElement | null) {
    if (!el) return null
    generating.value = true
    error.value = null
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: Math.min(2, window.devicePixelRatio || 2),
        backgroundColor: null,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      posterDataUrl.value = url
      return url
    } catch (e) {
      error.value = e instanceof Error ? e.message : '生成海报失败'
      return null
    } finally {
      generating.value = false
    }
  }

  function clearPoster() {
    posterDataUrl.value = null
    error.value = null
  }

  return {
    posterDataUrl,
    generating,
    error,
    generateFromElement,
    clearPoster,
  }
}
