import { Center, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import type { Group } from 'three'
import { models } from '../../data/content'

useGLTF.preload(models.face)
useGLTF.preload(models.facialBottle)
useGLTF.preload(models.sunscreenTube)

const BASE_YAW = Math.PI + 0.35 - Math.PI / 4 + Math.PI / 2
const MAX_YAW_OFFSET = 0.55

function GlbModel({
  url,
  mouseX,
  followMouse,
  spin,
  scale = 0.9,
  tilt = [0, 0, 0],
}: {
  url: string
  mouseX: MutableRefObject<number>
  followMouse: boolean
  spin: boolean
  scale?: number
  /** Fixed Euler tilt [x, y, z] in radians */
  tilt?: [number, number, number]
}) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => scene.clone(true), [scene])
  const group = useRef<Group>(null)
  const yaw = useRef(followMouse ? BASE_YAW : 0)

  useFrame((_, delta) => {
    if (!group.current) return
    if (followMouse) {
      const target = BASE_YAW + mouseX.current * MAX_YAW_OFFSET
      yaw.current += (target - yaw.current) * Math.min(1, delta * 2.2)
      group.current.rotation.y = yaw.current
    } else if (spin) {
      group.current.rotation.y += delta * 0.45
    }
  })

  return (
    <Center>
      <group rotation={tilt}>
        <group
          ref={group}
          scale={scale}
          rotation={followMouse ? [0, BASE_YAW, 0] : [0, 0, 0]}
        >
          <primitive object={clone} />
        </group>
      </group>
    </Center>
  )
}

export default function FaceScene({
  compact = false,
  model = models.face,
  followMouse = true,
  spin = false,
  modelScale = 0.9,
  tilt = [0, 0, 0],
}: {
  compact?: boolean
  model?: string
  followMouse?: boolean
  spin?: boolean
  modelScale?: number
  tilt?: [number, number, number]
}) {
  const mouseX = useRef(0)

  useEffect(() => {
    if (!followMouse) return
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [followMouse])

  return (
    <div className={compact ? 'relative h-full w-full' : 'relative h-[280px] w-full md:h-[360px]'}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted">Loading…</div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.15, compact ? 3.8 : 3.4], fov: compact ? 36 : 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <ambientLight intensity={1.15} />
          <directionalLight position={[3, 4, 2]} intensity={1.65} />
          <directionalLight position={[-2, 1, -2]} intensity={0.45} color="#38bdf8" />
          <GlbModel
            url={model}
            mouseX={mouseX}
            followMouse={followMouse}
            spin={spin}
            scale={modelScale}
            tilt={tilt}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
