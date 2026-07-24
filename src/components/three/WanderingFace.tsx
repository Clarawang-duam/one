import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import FaceScene from './FaceScene'
import { models } from '../../data/content'

type Vec = { x: number; y: number }

const PAD = 12
const MAX_SPEED = 48
const MIN_SPEED = 22
const DAMPING = 0.994
const WANDER_FORCE = 36
const BOUNCE = 1.02

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function ensureMinSpeed(vel: Vec) {
  const speed = Math.hypot(vel.x, vel.y)
  if (speed < MIN_SPEED) {
    if (speed < 0.01) {
      const a = Math.random() * Math.PI * 2
      vel.x = Math.cos(a) * MIN_SPEED
      vel.y = Math.sin(a) * MIN_SPEED
    } else {
      vel.x = (vel.x / speed) * MIN_SPEED
      vel.y = (vel.y / speed) * MIN_SPEED
    }
  }
}

type WanderingProps = {
  cardRef: RefObject<HTMLElement | null>
  active: boolean
  size?: number
  spawnX?: number
  spawnY?: number
  initialVel?: Vec
  children: ReactNode
}

/** Wanders randomly behind project text — edge bounce only, no text avoidance. */
export function WanderingBackdrop({
  cardRef,
  active,
  size = 160,
  spawnX = 0.5,
  spawnY = 0.55,
  initialVel = { x: 36, y: -28 },
  children,
}: WanderingProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const pos = useRef<Vec>({ x: 80, y: 120 })
  const vel = useRef<Vec>({ ...initialVel })
  const wander = useRef<Vec>({ x: 0.8, y: 0.4 })
  const wanderTimer = useRef(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const card = cardRef.current
      const shell = shellRef.current
      if (!card || !shell) return

      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const w = card.clientWidth
      const h = card.clientHeight
      const maxX = Math.max(PAD, w - size - PAD)
      const maxY = Math.max(PAD, h - size - PAD)

      wanderTimer.current -= dt
      if (wanderTimer.current <= 0) {
        const a = Math.random() * Math.PI * 2
        wander.current = { x: Math.cos(a), y: Math.sin(a) }
        wanderTimer.current = 1.2 + Math.random() * 1.6
      }

      vel.current.x = (vel.current.x + wander.current.x * WANDER_FORCE * dt) * DAMPING
      vel.current.y = (vel.current.y + wander.current.y * WANDER_FORCE * dt) * DAMPING
      ensureMinSpeed(vel.current)

      const speed = Math.hypot(vel.current.x, vel.current.y)
      if (speed > MAX_SPEED) {
        vel.current.x = (vel.current.x / speed) * MAX_SPEED
        vel.current.y = (vel.current.y / speed) * MAX_SPEED
      }

      pos.current.x += vel.current.x * dt
      pos.current.y += vel.current.y * dt

      if (pos.current.x < PAD) {
        pos.current.x = PAD
        vel.current.x = Math.abs(vel.current.x) * BOUNCE
        wander.current.x = Math.abs(wander.current.x) || 1
      } else if (pos.current.x > maxX) {
        pos.current.x = maxX
        vel.current.x = -Math.abs(vel.current.x) * BOUNCE
        wander.current.x = -Math.abs(wander.current.x) || -1
      }
      if (pos.current.y < PAD) {
        pos.current.y = PAD
        vel.current.y = Math.abs(vel.current.y) * BOUNCE
        wander.current.y = Math.abs(wander.current.y) || 1
      } else if (pos.current.y > maxY) {
        pos.current.y = maxY
        vel.current.y = -Math.abs(vel.current.y) * BOUNCE
        wander.current.y = -Math.abs(wander.current.y) || -1
      }

      pos.current.x = clamp(pos.current.x, PAD, maxX)
      pos.current.y = clamp(pos.current.y, PAD, maxY)
      shell.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
    }

    const card = cardRef.current
    if (card) {
      pos.current = {
        x: clamp(card.clientWidth * spawnX - size / 2, PAD, card.clientWidth - size - PAD),
        y: clamp(card.clientHeight * spawnY - size / 2, PAD, card.clientHeight - size - PAD),
      }
      vel.current = { x: initialVel.x, y: initialVel.y }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- spawn/vel only on activate
  }, [active, cardRef, size, spawnX, spawnY])

  if (!active) return null

  return (
    <div
      ref={shellRef}
      className="pointer-events-none absolute left-0 top-0 z-0"
      style={{ width: size, height: size, willChange: 'transform' }}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative h-full w-full opacity-90">{children}</div>
    </div>
  )
}

/** Face / bottle / tube wander behind Project 2 text cards. */
export default function WanderingFace({
  cardRef,
  active,
}: {
  cardRef: RefObject<HTMLElement | null>
  active: boolean
}) {
  return (
    <>
      <WanderingBackdrop
        cardRef={cardRef}
        active={active}
        size={160}
        spawnX={0.55}
        spawnY={0.5}
        initialVel={{ x: 36, y: -28 }}
      >
        <FaceScene compact model={models.face} followMouse modelScale={0.9} />
      </WanderingBackdrop>
      <WanderingBackdrop
        cardRef={cardRef}
        active={active}
        size={150}
        spawnX={0.28}
        spawnY={0.62}
        initialVel={{ x: -30, y: 26 }}
      >
        <FaceScene
          compact
          model={models.facialBottle}
          followMouse={false}
          spin
          modelScale={1.15}
        />
      </WanderingBackdrop>
      <WanderingBackdrop
        cardRef={cardRef}
        active={active}
        size={145}
        spawnX={0.72}
        spawnY={0.68}
        initialVel={{ x: 24, y: 34 }}
      >
        <FaceScene
          compact
          model={models.sunscreenTube}
          followMouse={false}
          spin
          modelScale={1.1}
          tilt={[0, 0, Math.PI / 4]}
        />
      </WanderingBackdrop>
    </>
  )
}
