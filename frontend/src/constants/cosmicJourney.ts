export interface CosmicJourneyStreak {
  id: number
  y: number
  width: number
  height: number
  delay: number
  duration: number
  opacity: number
  tone: 'teal' | 'gold' | 'mint'
}

export interface CosmicJourneyOrb {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  layer: 'front' | 'mid' | 'back'
  tone: 'glass' | 'mint' | 'gold' | 'blur'
}

export interface CosmicJourneySparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

/** 参考设计稿：自左向右冲向传送门的光轨与装饰粒子 */
export const COSMIC_JOURNEY_STREAKS: CosmicJourneyStreak[] = [
  { id: 0, y: 22, width: 48, height: 2, delay: 0, duration: 2.8, opacity: 0.75, tone: 'teal' },
  { id: 1, y: 28, width: 62, height: 3, delay: 0.6, duration: 2.2, opacity: 0.9, tone: 'gold' },
  { id: 2, y: 36, width: 38, height: 2, delay: 1.4, duration: 3.1, opacity: 0.55, tone: 'mint' },
  { id: 3, y: 44, width: 72, height: 4, delay: 0.2, duration: 2.5, opacity: 0.85, tone: 'gold' },
  { id: 4, y: 52, width: 44, height: 2, delay: 2.1, duration: 2.9, opacity: 0.65, tone: 'teal' },
  { id: 5, y: 58, width: 56, height: 3, delay: 1.1, duration: 2.4, opacity: 0.8, tone: 'gold' },
  { id: 6, y: 66, width: 34, height: 2, delay: 2.8, duration: 3.4, opacity: 0.5, tone: 'mint' },
  { id: 7, y: 72, width: 68, height: 3, delay: 0.9, duration: 2.6, opacity: 0.72, tone: 'teal' },
  { id: 8, y: 48, width: 52, height: 2, delay: 3.2, duration: 3, opacity: 0.6, tone: 'mint' },
  { id: 9, y: 32, width: 40, height: 2, delay: 1.8, duration: 2.7, opacity: 0.7, tone: 'teal' },
]

export const COSMIC_JOURNEY_ORBS: CosmicJourneyOrb[] = [
  { id: 0, x: 12, y: 28, size: 52, opacity: 0.35, delay: 0, layer: 'back', tone: 'blur' },
  { id: 1, x: 68, y: 62, size: 38, opacity: 0.42, delay: 1.2, layer: 'back', tone: 'blur' },
  { id: 2, x: 24, y: 68, size: 22, opacity: 0.55, delay: 0.6, layer: 'mid', tone: 'mint' },
  { id: 3, x: 58, y: 38, size: 28, opacity: 0.48, delay: 2, layer: 'mid', tone: 'gold' },
  { id: 4, x: 78, y: 52, size: 18, opacity: 0.62, delay: 1.5, layer: 'mid', tone: 'mint' },
  { id: 5, x: 82, y: 44, size: 44, opacity: 0.72, delay: 0.3, layer: 'front', tone: 'glass' },
  { id: 6, x: 6, y: 52, size: 14, opacity: 0.5, delay: 2.4, layer: 'front', tone: 'mint' },
  { id: 7, x: 42, y: 18, size: 16, opacity: 0.45, delay: 1.8, layer: 'front', tone: 'gold' },
]

export const COSMIC_JOURNEY_SPARKLES: CosmicJourneySparkle[] = [
  { id: 0, x: 18, y: 24, size: 10, delay: 0 },
  { id: 1, x: 34, y: 42, size: 8, delay: 0.8 },
  { id: 2, x: 52, y: 30, size: 12, delay: 1.6 },
  { id: 3, x: 70, y: 48, size: 9, delay: 0.4 },
  { id: 4, x: 86, y: 36, size: 11, delay: 2.2 },
  { id: 5, x: 28, y: 58, size: 7, delay: 1.2 },
  { id: 6, x: 46, y: 72, size: 10, delay: 2.8 },
  { id: 7, x: 62, y: 64, size: 8, delay: 0.6 },
  { id: 8, x: 76, y: 22, size: 9, delay: 1.9 },
  { id: 9, x: 14, y: 78, size: 8, delay: 2.5 },
  { id: 10, x: 38, y: 16, size: 7, delay: 3.1 },
  { id: 11, x: 90, y: 58, size: 10, delay: 1.4 },
]
