import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  twinkle: number
}

function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    size: Math.random() * 1.6 + 0.3,
    opacity: Math.random() * 0.7 + 0.25,
    twinkle: Math.random() * Math.PI * 2,
  }))
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let stars: Star[] = []
    let raf = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = createStars(width < 768 ? 120 : 180, width, height)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#020817'
      ctx.fillRect(0, 0, width, height)

      for (const star of stars) {
        if (!reduceMotion) {
          star.x += star.vx
          star.y += star.vy
          star.twinkle += 0.01

          if (star.x < -2) star.x = width + 2
          if (star.x > width + 2) star.x = -2
          if (star.y < -2) star.y = height + 2
          if (star.y > height + 2) star.y = -2
        }

        const pulse = reduceMotion ? 1 : 0.65 + Math.sin(star.twinkle) * 0.35
        ctx.beginPath()
        ctx.fillStyle = `rgba(232, 238, 247, ${star.opacity * pulse})`
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduceMotion && running) {
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
