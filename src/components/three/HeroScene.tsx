import { Center, useGLTF, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useRef, type MutableRefObject } from 'react'
import {
  Box3,
  Mesh,
  Raycaster,
  Vector3,
  type Group,
  type Object3D,
} from 'three'
import { models } from '../../data/content'

useGLTF.preload(models.hellokitty)
useGLTF.preload(models.iron)

const BOARD_TILT_X = (-60 * Math.PI) / 180
const KITTY_YAW = (-35 * Math.PI) / 180 + Math.PI - Math.PI / 3
const DOWN = new Vector3(0, -1, 0)
const _origin = new Vector3()
const _size = new Vector3()

function collectMeshes(root: Object3D) {
  const meshes: Mesh[] = []
  root.traverse((obj) => {
    if (obj instanceof Mesh) meshes.push(obj)
  })
  return meshes
}

function Kitty({ rootRef }: { rootRef: MutableRefObject<Group | null> }) {
  const { scene } = useGLTF(models.hellokitty)
  return (
    <group ref={rootRef}>
      <group rotation={[BOARD_TILT_X, 0, 0]}>
        <group rotation={[0, KITTY_YAW, 0]}>
          <Center>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={3.3}>
              <primitive object={scene} />
            </group>
          </Center>
        </group>
      </group>
    </group>
  )
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function softClamp(v: number, min: number, max: number) {
  const c = (min + max) * 0.5
  const h = Math.max(1e-4, (max - min) * 0.5)
  return c + h * Math.tanh((v - c) / h)
}

function Iron({
  mouseX,
  mouseY,
  kittyRef,
}: {
  mouseX: MutableRefObject<number>
  mouseY: MutableRefObject<number>
  kittyRef: MutableRefObject<Group | null>
}) {
  const { scene } = useGLTF(models.iron)
  const pivot = useRef<Group>(null)
  const ironMesh = useRef<Group>(null)
  const smoothedX = useRef(0)
  const smoothedZ = useRef(0)
  const smoothedY = useRef(1)
  const smoothedSurfaceY = useRef<number | null>(null)
  const clock = useRef(0)
  const soleOffset = useRef(0.4)
  const raycaster = useRef(new Raycaster())
  const meshes = useRef<Mesh[]>([])
  const lastHit = useRef(new Vector3(0, 0.5, 0))
  const bounds = useRef({
    minX: -1.2,
    maxX: 1.2,
    minZ: -1.2,
    maxZ: 1.2,
    maxY: 2,
    ready: false,
  })

  useLayoutEffect(() => {
    if (!ironMesh.current) return
    const box = new Box3().setFromObject(ironMesh.current)
    soleOffset.current = Math.max(0.05, -box.min.y)
  }, [scene])

  useFrame((_, delta) => {
    if (!pivot.current) return

    if (kittyRef.current) {
      if (meshes.current.length === 0) {
        meshes.current = collectMeshes(kittyRef.current)
      }
      const box = new Box3().setFromObject(kittyRef.current)
      if (!box.isEmpty()) {
        box.getSize(_size)
        if (_size.x > 0.01) {
          bounds.current.minX = box.min.x
          bounds.current.maxX = box.max.x
          bounds.current.minZ = box.min.z
          bounds.current.maxZ = box.max.z
          bounds.current.maxY = box.max.y
          bounds.current.ready = true
        }
      }
    }

    const b = bounds.current
    const margin = 0.2
    const softPad = 0.35
    const centerX = (b.minX + b.maxX) * 0.5
    const centerZ = (b.minZ + b.maxZ) * 0.5
    const halfX = Math.max(0.15, (b.maxX - b.minX) * 0.5 - margin)
    const halfZ = Math.max(0.15, (b.maxZ - b.minZ) * 0.5 - margin)

    const rawX = centerX + mouseX.current * (halfX + softPad)
    const rawZ = centerZ - mouseY.current * (halfZ + softPad)
    const targetX = softClamp(rawX, b.minX + margin, b.maxX - margin)
    const targetZ = softClamp(rawZ, b.minZ + margin, b.maxZ - margin)
    const follow = Math.min(1, delta * 5.5)
    smoothedX.current += (targetX - smoothedX.current) * follow
    smoothedZ.current += (targetZ - smoothedZ.current) * follow

    const x = smoothedX.current
    const z = smoothedZ.current

    // Multi-sample raycast under iron footprint — use highest hit so feet don't pierce
    let surfaceY = lastHit.current.y
    if (meshes.current.length > 0) {
      const samples: [number, number][] = [
        [0, 0],
        [0.45, 0],
        [-0.35, 0],
        [0, 0.35],
        [0, -0.35],
        [0.55, 0.3],
        [0.55, -0.3],
        [0.35, 0.45],
        [0.35, -0.45],
      ]
      let maxY = -Infinity
      let best = lastHit.current
      for (const [ox, oz] of samples) {
        _origin.set(x + ox, b.maxY + 4, z + oz)
        raycaster.current.set(_origin, DOWN)
        raycaster.current.far = 20
        const hits = raycaster.current.intersectObjects(meshes.current, false)
        if (hits.length > 0 && hits[0].point.y > maxY) {
          maxY = hits[0].point.y
          best = hits[0].point
        }
      }
      if (maxY > -Infinity) {
        lastHit.current.copy(best)
        surfaceY = maxY
      }
    }

    // Stronger smoothing on surface height to reduce jitter near uneven areas (feet)
    if (smoothedSurfaceY.current === null) {
      smoothedSurfaceY.current = surfaceY
    } else {
      const heightFollow = Math.min(1, delta * 3.2)
      smoothedSurfaceY.current += (surfaceY - smoothedSurfaceY.current) * heightFollow
    }
    const stableSurfaceY = smoothedSurfaceY.current

    clock.current += delta
    const phase = (clock.current % 4.6) / 4.6

    let pressAmount = 0
    if (phase < 0.36) pressAmount = smoothstep(phase / 0.36)
    else if (phase < 0.5) pressAmount = 1
    else if (phase < 0.86) pressAmount = 1 - smoothstep((phase - 0.5) / 0.36)

    const contactGap = 0.04
    const liftAmount = 0.28

    // Provisional pose at raycast hit
    let yTarget = (() => {
      const contactY = stableSurfaceY + soleOffset.current + contactGap
      const liftY = contactY + liftAmount
      if (phase < 0.36) return liftY + (contactY - liftY) * smoothstep(phase / 0.36)
      if (phase < 0.5) return contactY
      if (phase < 0.86) return contactY + (liftY - contactY) * smoothstep((phase - 0.5) / 0.36)
      return liftY
    })()

    smoothedY.current += (yTarget - smoothedY.current) * Math.min(1, delta * 8)

    pivot.current.position.x = x
    pivot.current.position.y = smoothedY.current
    pivot.current.position.z = z

    // Keep original iron angles; less dig-in pitch while pressing
    pivot.current.rotation.x = 0.35 + pressAmount * 0.03
    pivot.current.rotation.y = Math.PI * 0.15
    pivot.current.rotation.z = -(x - centerX) * 0.07 + pressAmount * 0.015
    pivot.current.updateWorldMatrix(true, true)

    // Push up so the lowest point of the iron never goes under the hit surface
    if (ironMesh.current && bounds.current.ready) {
      const ironBox = new Box3().setFromObject(ironMesh.current)
      if (!ironBox.isEmpty()) {
        const minClearance = stableSurfaceY + contactGap
        if (ironBox.min.y < minClearance) {
          const lift = minClearance - ironBox.min.y
          pivot.current.position.y += lift
          smoothedY.current = pivot.current.position.y
        }
      }
    }
  })

  return (
    <group ref={pivot} position={[0, 1, 0.35]} rotation={[0.35, Math.PI * 0.15, 0.1]}>
      <group ref={ironMesh}>
        <Center>
          <group scale={[-2.7, 2.7, 2.7]}>
            <primitive object={scene} />
          </group>
        </Center>
      </group>
    </group>
  )
}

function MouseBridge({
  mouse,
  mouseX,
  mouseY,
}: {
  mouse: MutableRefObject<{ x: number; y: number }>
  mouseX: MutableRefObject<number>
  mouseY: MutableRefObject<number>
}) {
  useFrame(() => {
    mouseX.current += (mouse.current.x - mouseX.current) * 0.18
    mouseY.current += (mouse.current.y - mouseY.current) * 0.18
  })
  return null
}

function LoaderHint() {
  const { progress, active } = useProgress()
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-muted">
      Loading 3D… {Math.round(progress)}%
    </div>
  )
}

type HeroSceneProps = {
  mouse: MutableRefObject<{ x: number; y: number }>
}

export default function HeroScene({ mouse }: HeroSceneProps) {
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const kittyRef = useRef<Group | null>(null)

  return (
    <div className="relative h-full w-full">
      <LoaderHint />
      <Canvas
        camera={{ position: [2.0, 3.0, 4.4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 8, 4]} intensity={2.3} />
        <directionalLight position={[-4, 3, -2]} intensity={0.75} color="#7dd3fc" />
        <MouseBridge mouse={mouse} mouseX={mouseX} mouseY={mouseY} />
        <Suspense fallback={null}>
          <group>
            <Kitty rootRef={kittyRef} />
            <Iron mouseX={mouseX} mouseY={mouseY} kittyRef={kittyRef} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}
