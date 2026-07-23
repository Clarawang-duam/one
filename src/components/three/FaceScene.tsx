import { Center, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState, type MutableRefObject } from 'react'
import type { Group, Mesh } from 'three'
import { models } from '../../data/content'

useGLTF.preload(models.face)

const BASE_YAW = Math.PI + 0.35 - Math.PI / 4 + Math.PI / 2
const MAX_YAW_OFFSET = 0.55
const DROP_COUNT = 10

type DropState = {
  x: number
  y: number
  z: number
  speed: number
  size: number
  delay: number
  opacity: number
}

function createDrops(): DropState[] {
  return Array.from({ length: DROP_COUNT }, () => ({
    x: (Math.random() - 0.5) * 1.1,
    y: 0.85 + Math.random() * 0.45,
    z: 0.35 + Math.random() * 0.25,
    speed: 0.55 + Math.random() * 0.65,
    size: 0.035 + Math.random() * 0.03,
    delay: Math.random() * 1.4,
    opacity: 0.35 + Math.random() * 0.45,
  }))
}

function WaterDrops({ hovering }: { hovering: MutableRefObject<boolean> }) {
  const group = useRef<Group>(null)
  const drops = useRef(createDrops())
  const elapsed = useRef(0)
  const meshes = useRef<(Mesh | null)[]>(Array.from({ length: DROP_COUNT }, () => null))

  useFrame((_, delta) => {
    if (!group.current) return
    const on = hovering.current
    group.current.visible = on

    if (!on) {
      elapsed.current = 0
      return
    }

    elapsed.current += delta
    drops.current.forEach((d, i) => {
      const mesh = meshes.current[i]
      if (!mesh) return
      if (elapsed.current < d.delay) {
        mesh.visible = false
        return
      }
      mesh.visible = true
      d.y -= d.speed * delta
      mesh.position.set(d.x, d.y, d.z)
      mesh.scale.set(d.size, d.size * 1.55, d.size)
      const mat = mesh.material as { opacity: number }
      mat.opacity = d.opacity * Math.min(1, (d.y + 1.2) / 1.5)

      if (d.y < -1.15) {
        d.x = (Math.random() - 0.5) * 1.1
        d.y = 0.9 + Math.random() * 0.4
        d.z = 0.35 + Math.random() * 0.25
        d.speed = 0.55 + Math.random() * 0.65
        d.delay = elapsed.current + Math.random() * 0.35
      }
    })
  })

  return (
    <group ref={group} visible={false}>
      {drops.current.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el
          }}
          position={[d.x, d.y, d.z]}
          scale={[d.size, d.size * 1.5, d.size]}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial
            color="#7dd3fc"
            transparent
            opacity={d.opacity}
            roughness={0.05}
            metalness={0.05}
            transmission={0.55}
            thickness={0.4}
            ior={1.33}
          />
        </mesh>
      ))}
    </group>
  )
}

function FaceModel({ mouseX }: { mouseX: MutableRefObject<number> }) {
  const { scene } = useGLTF(models.face)
  const group = useRef<Group>(null)
  const yaw = useRef(BASE_YAW)

  useFrame((_, delta) => {
    if (!group.current) return
    const target = BASE_YAW + mouseX.current * MAX_YAW_OFFSET
    yaw.current += (target - yaw.current) * Math.min(1, delta * 2.2)
    group.current.rotation.y = yaw.current
  })

  return (
    <Center>
      <group ref={group} scale={1.8} rotation={[0, BASE_YAW, 0]}>
        <primitive object={scene} />
      </group>
    </Center>
  )
}

export default function FaceScene() {
  const mouseX = useRef(0)
  const hovering = useRef(false)
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      className="relative h-[280px] w-full md:h-[360px]"
      onMouseEnter={() => {
        hovering.current = true
        setIsHover(true)
      }}
      onMouseLeave={() => {
        hovering.current = false
        setIsHover(false)
      }}
    >
      {/* Soft mist hint while hovering */}
      <div
        className={`pointer-events-none absolute inset-x-8 top-4 z-10 h-16 rounded-full bg-sky-300/10 blur-2xl transition-opacity duration-500 ${
          isHover ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted">Loading…</div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.2, 3.4], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 2]} intensity={1.6} />
          <directionalLight position={[-2, 1, -2]} intensity={0.45} color="#38bdf8" />
          <FaceModel mouseX={mouseX} />
          <WaterDrops hovering={hovering} />
        </Canvas>
      </Suspense>
    </div>
  )
}
