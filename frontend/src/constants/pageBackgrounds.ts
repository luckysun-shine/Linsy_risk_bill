import cloud1 from '@/assets/images/bg-cloud-1.png'
import cloud2 from '@/assets/images/bg-cloud-2.png'
import type { PageType } from '@/types/bill'

export type SkyBgVariant =
  | 'loading'
  | 'cover'
  | 'stats'
  | 'manager'
  | 'risk_pie'
  | 'risk_rectification'
  | 'milestone'
  | 'dept_focus'
  | 'cluster'
  | 'achievement'
  | 'poster'
  | 'default'

export const SKY_CLOUDS = {
  cloud1,
  cloud2,
} as const

/** 各分屏天空背景变体（同一 common-bg 底图，不同构图与装饰） */
export const PAGE_SKY_VARIANT: Partial<Record<PageType | 'loading', SkyBgVariant>> = {
  loading: 'loading',
  cover: 'cover',
  stats: 'stats',
  manager: 'manager',
  risk_pie: 'risk_pie',
  risk_rectification: 'risk_rectification',
  milestone: 'milestone',
  dept_focus: 'milestone',
  cluster: 'cluster',
  achievement: 'achievement',
  poster: 'poster',
}

export function resolveSkyVariant(
  variant?: SkyBgVariant,
  pageType?: PageType | 'loading'
): SkyBgVariant {
  if (variant) return variant
  if (pageType && PAGE_SKY_VARIANT[pageType]) {
    return PAGE_SKY_VARIANT[pageType]!
  }
  return 'default'
}
