import { onUnmounted, ref, watch, type Ref } from 'vue'

export interface UseCountUpOptions {
  duration?: number
  decimals?: number
}

export function useCountUp(
  target: Ref<number>,
  isActive: Ref<boolean>,
  options: UseCountUpOptions = {}
) {
  const { duration = 1200, decimals = 0 } = options
  const display = ref(0)
  let raf = 0
  let startTime = 0
  let from = 0

  const cancel = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const tick = (now: number) => {
    if (!startTime) startTime = now
    const t = Math.min(1, (now - startTime) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    const value = from + (target.value - from) * eased
    const factor = Math.pow(10, decimals)
    display.value = Math.round(value * factor) / factor
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      display.value = target.value
      raf = 0
    }
  }

  watch(
    [isActive, target],
    ([active]) => {
      cancel()
      if (!active) {
        display.value = 0
        return
      }
      from = 0
      startTime = 0
      raf = requestAnimationFrame(tick)
    },
    { immediate: true }
  )

  onUnmounted(cancel)

  return { display }
}
