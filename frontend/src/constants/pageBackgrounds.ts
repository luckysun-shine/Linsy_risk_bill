import bgJourneyA from '@/assets/images/bg-journey-a.jpg'
import bgJourneyB from '@/assets/images/bg-journey-b.jpg'
import bgJourneyC from '@/assets/images/bg-journey-c.jpg'
import bgJourneyPoster from '@/assets/images/bg-journey-poster.jpg'
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

/** 各分屏天空背景图片映射（采用用户提供的精美原图） */
export const BG_JOURNEY_IMAGES = {
  a: bgJourneyA, // 飞行战车疾驰版（Cover / Loading / Achievement）
  b: bgJourneyB, // 坐方块小人版（图表数据页：Pie / Rectification / Cluster / DeptFocus）
  c: bgJourneyC, // 提灯奔跑小人版（数读 / 里程碑 / 管理者榜单）
  poster: bgJourneyPoster, // 追光者完稿海报版
} as const

export const PAGE_BG_IMAGE_MAP: Record<SkyBgVariant, string> = {
  loading: bgJourneyA,
  cover: bgJourneyA,
  stats: bgJourneyC,
  manager: bgJourneyC,
  milestone: bgJourneyC,
  risk_pie: bgJourneyB,
  risk_rectification: bgJourneyB,
  dept_focus: bgJourneyB,
  cluster: bgJourneyB,
  achievement: bgJourneyA,
  poster: bgJourneyPoster,
  default: bgJourneyA,
}

/** 各分屏天空背景变体匹配 */
export const PAGE_SKY_VARIANT: Partial<Record<PageType | 'loading', SkyBgVariant>> = {
  loading: 'loading',
  cover: 'cover',
  stats: 'stats',
  manager: 'manager',
  risk_pie: 'risk_pie',
  risk_rectification: 'risk_rectification',
  milestone: 'milestone',
  dept_focus: 'dept_focus',
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

export function getBgImageForVariant(variant: SkyBgVariant): string {
  return PAGE_BG_IMAGE_MAP[variant] || bgJourneyA
}

