/** 通用分屏入场：渐显 + 由小变大 + 自底部弹出 */
export function animateSlideEntrance(
  tl: gsap.core.Timeline,
  scope: HTMLElement | null,
  selectors: string[]
) {
  if (!scope) return
  selectors.forEach((selector, index) => {
    const el = scope.querySelector(selector)
    if (!el) return
    tl.from(
      el,
      {
        y: 18,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      index === 0 ? 0 : '-=0.28'
    )
  })
}
