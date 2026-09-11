export interface CosmicStar {
  id: number
  x: number
  y: number
  size: number
  layer: 1 | 2 | 3
  delay: number
  tone: 'white' | 'gold' | 'cyan'
}

export interface CosmicMeteor {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  length: number
  angle: number
}

export interface CosmicWarpTrail {
  id: number
  x: number
  delay: number
  duration: number
  height: number
  opacity: number
}

export interface CosmicParticle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  driftX: number
}

export interface CosmicNebula {
  id: number
  x: number
  y: number
  size: number
  tone: 'mint' | 'gold' | 'violet'
  delay: number
}

export interface CosmicScene {
  stars: CosmicStar[]
  meteors: CosmicMeteor[]
  warpTrails: CosmicWarpTrail[]
  particles: CosmicParticle[]
  nebulae: CosmicNebula[]
  constellation: Array<{ x1: number; y1: number; x2: number; y2: number }>
}

function createRng(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const tones: CosmicStar['tone'][] = ['white', 'white', 'white', 'gold', 'cyan']

export function buildCosmicScene(seed = 2025): CosmicScene {
  const rng = createRng(seed)
  const stars: CosmicStar[] = []

  for (let i = 0; i < 96; i += 1) {
    const layer = (1 + Math.floor(rng() * 3)) as 1 | 2 | 3
    stars.push({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: layer === 1 ? 1 + rng() * 1.2 : layer === 2 ? 1.4 + rng() * 1.6 : 2 + rng() * 2.2,
      layer,
      delay: rng() * 6,
      tone: tones[Math.floor(rng() * tones.length)]!,
    })
  }

  const meteors: CosmicMeteor[] = []
  for (let i = 0; i < 10; i += 1) {
    meteors.push({
      id: i,
      x: rng() * 90 + 5,
      y: rng() * 35,
      delay: rng() * 8,
      duration: 1.8 + rng() * 2.4,
      length: 72 + rng() * 96,
      angle: 28 + rng() * 22,
    })
  }

  const warpTrails: CosmicWarpTrail[] = []
  for (let i = 0; i < 18; i += 1) {
    warpTrails.push({
      id: i,
      x: rng() * 100,
      delay: rng() * 4,
      duration: 1.2 + rng() * 1.8,
      height: 48 + rng() * 88,
      opacity: 0.25 + rng() * 0.45,
    })
  }

  const particles: CosmicParticle[] = []
  for (let i = 0; i < 32; i += 1) {
    particles.push({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: 1 + rng() * 2.2,
      delay: rng() * 5,
      duration: 6 + rng() * 10,
      driftX: (rng() - 0.5) * 36,
    })
  }

  const nebulae: CosmicNebula[] = [
    { id: 0, x: 12, y: 18, size: 42, tone: 'mint', delay: 0 },
    { id: 1, x: 78, y: 62, size: 36, tone: 'gold', delay: 2.4 },
    { id: 2, x: 52, y: 8, size: 28, tone: 'violet', delay: 1.2 },
    { id: 3, x: 88, y: 28, size: 22, tone: 'mint', delay: 3.6 },
    { id: 4, x: 24, y: 72, size: 34, tone: 'gold', delay: 1.8 },
  ]

  const brightStars = stars
    .filter((s) => s.layer === 3)
    .slice(0, 7)
    .map((s) => ({ x: s.x, y: s.y }))

  const constellation: CosmicScene['constellation'] = []
  for (let i = 0; i < brightStars.length - 1; i += 1) {
    if (rng() > 0.35) {
      const a = brightStars[i]!
      const b = brightStars[i + 1]!
      constellation.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }
  }

  return { stars, meteors, warpTrails, particles, nebulae, constellation }
}

export const COSMIC_SCENE = buildCosmicScene()

export interface CosmicEnergyBolt {
  id: number
  y: number
  width: number
  height: number
  delay: number
  duration: number
  opacity: number
}

export const COSMIC_ENERGY_BOLTS: CosmicEnergyBolt[] = [
  { id: 0, y: 40, width: 58, height: 3, delay: 0.3, duration: 2.4, opacity: 0.82 },
  { id: 1, y: 50, width: 44, height: 2, delay: 1.6, duration: 2.8, opacity: 0.65 },
  { id: 2, y: 60, width: 66, height: 4, delay: 0.8, duration: 2.2, opacity: 0.9 },
  { id: 3, y: 34, width: 36, height: 2, delay: 2.2, duration: 3, opacity: 0.55 },
  { id: 4, y: 46, width: 52, height: 3, delay: 1.1, duration: 2.6, opacity: 0.75 },
  { id: 5, y: 68, width: 48, height: 2, delay: 2.6, duration: 2.9, opacity: 0.6 },
]
