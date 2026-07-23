import { Center, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  type Group,
  type Material,
} from 'three'
import { models } from '../../data/content'

const MAC_RED = '#FF5F56'
const MAC_YELLOW = '#FFBD2E'
const MAC_GREEN = '#27C93F'
const HIRE_ME_BLUE = '#38bdf8'

type Corner = 'tl' | 'tr' | 'bl' | 'br'

/** Order: 黄 → 红 → 蓝 → 绿 (stagger) */
const CYLINDERS: { url: string; corner: Corner; color: string }[] = [
  { url: models.yellow, corner: 'tl', color: MAC_YELLOW },
  { url: models.red, corner: 'tr', color: MAC_RED },
  { url: models.blue, corner: 'br', color: HIRE_ME_BLUE },
  { url: models.green, corner: 'bl', color: MAC_GREEN },
]

const BASE_SCALE = 0.6
const ENTER_SCALE = 0.6
const STAGGER = 0.07
const MOVE_SPEED = 5.2 // ~0.5s ease

function tintMaterials(root: Group, hex: string) {
  const color = new Color(hex)
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const apply = (mat: Material) => {
      const next = mat.clone()
      if ('color' in next && next.color instanceof Color) next.color.copy(color)
      if ('map' in next) {
        ;(next as MeshStandardMaterial).map = null
        ;(next as MeshStandardMaterial).needsUpdate = true
      }
      if ('emissive' in next && (next as MeshStandardMaterial).emissive) {
        ;(next as MeshStandardMaterial).emissive.copy(color).multiplyScalar(0.1)
      }
      return next
    }
    if (Array.isArray(obj.material)) obj.material = obj.material.map(apply)
    else if (obj.material) obj.material = apply(obj.material)
  })
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function CylinderModel({ url, color }: { url: string; color: string }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => {
    const next = scene.clone(true)
    tintMaterials(next as Group, color)
    return next
  }, [scene, color])

  return (
    <Center>
      <group scale={1}>
        <primitive object={clone} />
      </group>
    </Center>
  )
}

function cornerTargets(corner: Corner, halfW: number, halfH: number) {
  const ix = Math.max(0.85, halfW * 0.22)
  const iyTop = Math.max(0.9, halfH * 0.22)
  const iyBot = Math.max(0.9, halfH * 0.24)

  const restX = corner.includes('l') ? -halfW + ix : halfW - ix
  const restY = corner.includes('t') ? halfH - iyTop : -halfH + iyBot

  // Further outside the frame — slide in from / out toward true corners
  const pushX = Math.max(2.4, halfW * 0.55)
  const pushY = Math.max(2.2, halfH * 0.55)
  const outX = corner.includes('l') ? restX - pushX : restX + pushX
  const outY = corner.includes('t') ? restY + pushY : restY - pushY

  return { restX, restY, outX, outY }
}

function DriftingCylinder({
  url,
  corner,
  color,
  seed,
  index,
  wantedRef,
}: {
  url: string
  corner: Corner
  color: string
  seed: number
  index: number
  wantedRef: MutableRefObject<boolean>
}) {
  const ref = useRef<Group>(null)
  const { viewport } = useThree()
  const progress = useRef(0)
  const delayLeft = useRef(0)
  const lastWanted = useRef<boolean | null>(null)

  useFrame(({ clock }, delta) => {
    if (!ref.current) return

    const wanted = wantedRef.current
    if (lastWanted.current !== wanted) {
      lastWanted.current = wanted
      delayLeft.current = index * STAGGER
    }

    if (delayLeft.current > 0) {
      delayLeft.current -= delta
    } else {
      const target = wanted ? 1 : 0
      const k = Math.min(1, delta * MOVE_SPEED)
      progress.current += (target - progress.current) * k
    }

    const u = smoothstep(progress.current)
    const halfW = viewport.width * 0.5
    const halfH = viewport.height * 0.5
    const { restX, restY, outX, outY } = cornerTargets(corner, halfW, halfH)

    const t = clock.elapsedTime
    // Drift only when mostly visible
    const drift = u * u
    const dx = Math.sin(t * (0.22 + seed * 0.04) + seed) * 0.12 * drift
    const dy = Math.cos(t * (0.28 + seed * 0.03) + seed) * 0.1 * drift
    const dz = Math.sin(t * 0.2 + seed) * 0.08 * drift

    ref.current.position.x = lerp(outX, restX, u) + dx
    ref.current.position.y = lerp(outY, restY, u) + dy
    ref.current.position.z = dz

    const s = BASE_SCALE * lerp(ENTER_SCALE, 1, u)
    ref.current.scale.setScalar(Math.max(0.001, s))
    ref.current.visible = progress.current > 0.01

    ref.current.rotation.x = t * (0.4 + seed * 0.05)
    ref.current.rotation.y = t * (0.5 + seed * 0.04)
    ref.current.rotation.z = t * (0.25 + seed * 0.03)
  })

  return (
    <group ref={ref} visible={false} scale={0.001}>
      <CylinderModel url={url} color={color} />
    </group>
  )
}

function CylinderScene({ wantedRef }: { wantedRef: MutableRefObject<boolean> }) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2, 3, 4]} intensity={1.55} />
      {CYLINDERS.map((item, i) => (
        <DriftingCylinder
          key={item.url}
          {...item}
          seed={i + 1}
          index={i}
          wantedRef={wantedRef}
        />
      ))}
    </>
  )
}

/** True while the viewport focus sits inside #projects */
function isProjectsActive() {
  const el = document.getElementById('projects')
  if (!el) return false
  const rect = el.getBoundingClientRect()
  const anchor = window.innerHeight * 0.4
  return rect.top < anchor && rect.bottom > anchor
}

/**
 * Corner beads under text/cards.
 * Slide in when scrolling down into Projects; slide out when leaving Projects upward (or past it).
 */
export default function FloatingCylinders() {
  const wantedRef = useRef(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = () => {
      const w = isProjectsActive()
      wantedRef.current = w
      if (w) setReady(true)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    CYLINDERS.forEach((c) => useGLTF.preload(c.url))
  }, [ready])

  if (!ready) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <CylinderScene wantedRef={wantedRef} />
        </Canvas>
      </Suspense>
    </div>
  )
}
