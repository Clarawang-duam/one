export type KittySection = 'hero' | 'skills' | 'experience' | 'projects' | 'contact'

export type KittyTransform = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  /** 1 = show ironing, 0 = hide iron */
  iron: number
}

/** Scroll keyframes inspired by nareshkhatri keyboard STATES */
export const KITTY_STATES: Record<KittySection, KittyTransform> = {
  hero: {
    position: [1.15, -0.15, 0],
    rotation: [0, 0, 0],
    scale: 1,
    iron: 1,
  },
  skills: {
    position: [0, -0.1, 0],
    rotation: [0, Math.PI / 12, 0],
    scale: 0.9,
    iron: 0,
  },
  experience: {
    position: [0, -0.25, 0],
    rotation: [Math.PI / 12, -Math.PI / 4, 0],
    scale: 0.78,
    iron: 0,
  },
  projects: {
    position: [0, 0.15, 0],
    rotation: [Math.PI * 0.92, Math.PI / 3, Math.PI * 0.08],
    scale: 0.72,
    iron: 0,
  },
  contact: {
    position: [0, -0.55, 0],
    rotation: [0, 0, 0],
    scale: 0.85,
    iron: 0,
  },
}

export const KITTY_SECTION_ORDER: { id: string; key: KittySection }[] = [
  { id: 'top', key: 'hero' },
  { id: 'tech', key: 'skills' },
  { id: 'experience', key: 'experience' },
  { id: 'projects', key: 'projects' },
  { id: 'contact', key: 'contact' },
]

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function lerpTransform(a: KittyTransform, b: KittyTransform, t: number): KittyTransform {
  const u = Math.min(1, Math.max(0, t))
  // Iron leaves early on scroll-down; returns promptly on scroll-up
  const ironT =
    a.iron > b.iron
      ? Math.min(1, u * 1.85)
      : Math.min(1, u * 1.25)
  return {
    position: [
      lerp(a.position[0], b.position[0], u),
      lerp(a.position[1], b.position[1], u),
      lerp(a.position[2], b.position[2], u),
    ],
    rotation: [
      lerp(a.rotation[0], b.rotation[0], u),
      lerp(a.rotation[1], b.rotation[1], u),
      lerp(a.rotation[2], b.rotation[2], u),
    ],
    scale: lerp(a.scale, b.scale, u),
    iron: lerp(a.iron, b.iron, ironT),
  }
}

/** Blend between adjacent section states from current scroll */
export function getKittyScrollTransform(): KittyTransform {
  const order = KITTY_SECTION_ORDER
  const y = window.scrollY + window.innerHeight * 0.42

  const centers = order.map(({ id }) => {
    const el = document.getElementById(id)
    if (!el) return window.scrollY
    const rect = el.getBoundingClientRect()
    return rect.top + window.scrollY + rect.height * 0.35
  })

  if (y <= centers[0]) return KITTY_STATES[order[0].key]
  if (y >= centers[centers.length - 1]) return KITTY_STATES[order[order.length - 1].key]

  for (let i = 0; i < centers.length - 1; i++) {
    if (y >= centers[i] && y <= centers[i + 1]) {
      const span = Math.max(1, centers[i + 1] - centers[i])
      const t = (y - centers[i]) / span
      // Ease in-out for smoother section handoff
      const eased = t * t * (3 - 2 * t)
      return lerpTransform(KITTY_STATES[order[i].key], KITTY_STATES[order[i + 1].key], eased)
    }
  }

  return KITTY_STATES.hero
}
