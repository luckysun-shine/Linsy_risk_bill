import gsap from 'gsap'
import { onUnmounted, watch, type Ref } from 'vue'

export interface UseIsActiveAnimationOptions {
  onEnter?: () => void
  onLeave?: () => void
  resetOnLeave?: boolean
}

export function useIsActiveAnimation(
  isActive: Ref<boolean>,
  runTimeline: (tl: gsap.core.Timeline) => void,
  options: UseIsActiveAnimationOptions = {}
) {
  const { onEnter, onLeave, resetOnLeave = true } = options
  let tl: gsap.core.Timeline | null = null

  const build = () => {
    tl?.kill()
    tl = gsap.timeline({ paused: true })
    runTimeline(tl)
  }

  watch(
    isActive,
    (active) => {
      if (!tl) build()
      if (active) {
        onEnter?.()
        tl!.restart()
      } else {
        onLeave?.()
        if (resetOnLeave) {
          tl!.pause(0)
        } else {
          tl!.pause()
        }
      }
    },
    { immediate: true, flush: 'post' }
  )

  onUnmounted(() => {
    tl?.kill()
    tl = null
  })

  return { rebuild: build }
}

