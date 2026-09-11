import charHome from '@/assets/images/char-home.png'
import charDetail1 from '@/assets/images/char-detail-1.png'
import charDetail2 from '@/assets/images/char-detail-2.png'
import type { PageType } from '@/types/bill'

export type IpAssetKey = 'home' | 'detail1' | 'detail2'
export type IpPosition = 'bottom-left' | 'bottom-right' | 'bottom-center' | 'beside-card'

export const IP_ASSETS: Record<IpAssetKey, string> = {
  home: charHome,
  detail1: charDetail1,
  detail2: charDetail2,
}

/** 各分屏默认 IP 人物配置 */
export const PAGE_IP_MAP: Partial<
  Record<PageType | 'loading', { key: IpAssetKey; position: IpPosition }>
> = {
  loading: { key: 'home', position: 'bottom-center' },
  cover: { key: 'home', position: 'bottom-center' },
  stats: { key: 'detail1', position: 'bottom-right' },
  risk_pie: { key: 'detail2', position: 'bottom-right' },
  risk_rectification: { key: 'detail1', position: 'bottom-right' },
  milestone: { key: 'detail1', position: 'bottom-left' },
  dept_focus: { key: 'detail2', position: 'bottom-right' },
  cluster: { key: 'detail2', position: 'bottom-left' },
  achievement: { key: 'home', position: 'bottom-right' },
  manager: { key: 'detail1', position: 'bottom-right' },
  poster: { key: 'home', position: 'beside-card' },
}
