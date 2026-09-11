type SwiperLike = { allowTouchMove: boolean }

/**
 * 协调「页内滚动」与「竖向翻页」：
 * - 触达可滚动区时先禁用 Swiper，避免手势被翻页抢走（只能滑一点）
 * - 滚到顶/底继续同向滑时再交给 Swiper
 * - allow 仅在变化时写入
 */
export function installBillTouchGuard(options?: {
  getSwiper?: () => SwiperLike | null | undefined
}) {
  let startY = 0
  let startX = 0
  let scrollEl: HTMLElement | null = null
  let lastAllow: boolean | null = null

  const setAllowTouchMove = (allow: boolean) => {
    const swiper = options?.getSwiper?.()
    if (!swiper) return
    if (lastAllow === allow) return
    lastAllow = allow
    swiper.allowTouchMove = allow
  }

  const measure = (el: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    return {
      scrollTop,
      maxScroll,
      canScroll: maxScroll > 2,
      atTop: scrollTop <= 1,
      atBottom: scrollTop >= maxScroll - 1,
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    if (!e.touches[0]) return
    startY = e.touches[0].clientY
    startX = e.touches[0].clientX
    const target = e.target
    scrollEl =
      target instanceof Element
        ? (target.closest('[data-bill-scroll]') as HTMLElement | null)
        : null
    lastAllow = null

    if (scrollEl) {
      const { canScroll } = measure(scrollEl)
      // 关键：先把翻页关掉，否则前几像素会被 Swiper 吃掉，页内只能滑一点点
      setAllowTouchMove(!canScroll)
    } else {
      setAllowTouchMove(true)
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches[0] || e.touches.length > 1) return

    if (!scrollEl) {
      setAllowTouchMove(true)
      return
    }

    const dy = e.touches[0].clientY - startY
    const dx = e.touches[0].clientX - startX

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      setAllowTouchMove(false)
      return
    }

    if (Math.abs(dy) < 2) return

    const { canScroll, atTop, atBottom } = measure(scrollEl)

    if (!canScroll) {
      setAllowTouchMove(true)
      if (e.cancelable) e.preventDefault()
      return
    }

    // 手指上滑：未到底 → 页内滚；已到底 → 翻页
    if (dy < 0) {
      if (atBottom) {
        setAllowTouchMove(true)
        if (e.cancelable) e.preventDefault()
      } else {
        setAllowTouchMove(false)
      }
      return
    }

    // 手指下滑：未到顶 → 页内滚；已到顶 → 翻页
    if (dy > 0) {
      if (atTop) {
        setAllowTouchMove(true)
        if (e.cancelable) e.preventDefault()
      } else {
        setAllowTouchMove(false)
      }
    }
  }

  const onTouchEnd = () => {
    scrollEl = null
    lastAllow = null
    setAllowTouchMove(true)
  }

  document.addEventListener('touchstart', onTouchStart, {
    passive: true,
    capture: true,
  })
  document.addEventListener('touchmove', onTouchMove, {
    passive: false,
    capture: true,
  })
  document.addEventListener('touchend', onTouchEnd, {
    passive: true,
    capture: true,
  })
  document.addEventListener('touchcancel', onTouchEnd, {
    passive: true,
    capture: true,
  })

  disableHostWebViewBounce()

  return () => {
    document.removeEventListener('touchstart', onTouchStart, true)
    document.removeEventListener('touchmove', onTouchMove, true)
    document.removeEventListener('touchend', onTouchEnd, true)
    document.removeEventListener('touchcancel', onTouchEnd, true)
  }
}

function disableHostWebViewBounce() {
  const w = window as Window & {
    dd?: {
      ready?: (cb: () => void) => void
      ui?: { webViewBounce?: { disable?: () => void } }
      biz?: {
        navigation?: { setPullToRefresh?: (opts: { support: boolean }) => void }
      }
    }
    WeixinJSBridge?: { invoke?: (api: string) => void }
  }

  const disableDingTalk = () => {
    try {
      w.dd?.ui?.webViewBounce?.disable?.()
      w.dd?.biz?.navigation?.setPullToRefresh?.({ support: false })
    } catch {
      /* ignore */
    }
  }

  try {
    if (typeof w.dd?.ready === 'function') w.dd.ready(disableDingTalk)
    else disableDingTalk()
  } catch {
    /* ignore */
  }

  const disableWeChat = () => {
    try {
      w.WeixinJSBridge?.invoke?.('disablePullDownRefresh')
    } catch {
      /* ignore */
    }
  }

  disableWeChat()
  document.addEventListener('WeixinJSBridgeReady', disableWeChat, { once: true })
}
