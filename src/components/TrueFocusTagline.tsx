import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Segment = {
  text: string
  /** Stable key for focus cycle; omit for static filler */
  focusKey?: string
}

const SEGMENTS: Segment[] = [
  { text: 'SaaS+CRM', focusKey: 'saas' },
  { text: '产品设计、B 端' },
  { text: 'AI', focusKey: 'ai' },
  { text: '流程' },
  { text: '重构与提效', focusKey: 'refactor' },
  { text: '、' },
  { text: 'Vibe Coding', focusKey: 'vibe' },
  { text: '快速原型与全栈交付', focusKey: 'prototype' },
  { text: '、' },
  { text: '复杂业务逻辑抽象', focusKey: 'logic' },
]

/** Narrative focus order (not reading order) */
const FOCUS_ORDER = ['ai', 'vibe', 'refactor', 'logic', 'prototype', 'saas'] as const

const DWELL_MS = 1900
const FOCUS_BLUE = '#1e40af'

export default function TrueFocusTagline({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % FOCUS_ORDER.length)
    }, DWELL_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion])

  const activeKey = reduceMotion ? null : FOCUS_ORDER[index]

  return (
    <p
      className={`relative leading-relaxed tracking-[0.2em] ${className}`}
      style={{ color: '#ffffff', textShadow: 'none' }}
    >
      {SEGMENTS.map((seg, i) => {
        const isActive = Boolean(activeKey && seg.focusKey === activeKey)

        return (
          <span key={`${seg.text}-${i}`} className="relative inline-block px-0.5 py-0.5">
            <span
              className="relative z-[1] transition-[font-weight] duration-200"
              style={{ fontWeight: isActive ? 700 : 400 }}
            >
              {seg.text}
            </span>
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="tagline-focus-pill"
                  className="pointer-events-none absolute -inset-x-1 -inset-y-0.5 z-0 rounded-lg shadow-[0_0_16px_rgba(30,64,175,0.45)]"
                  style={{ backgroundColor: FOCUS_BLUE }}
                  transition={{
                    layout: { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 },
                    opacity: { duration: 0.2 },
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </span>
        )
      })}
    </p>
  )
}
