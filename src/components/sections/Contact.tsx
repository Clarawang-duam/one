import { motion } from 'framer-motion'
import { useState } from 'react'
import { site } from '../../data/content'
import RotatingText from '../RotatingText'

const ROTATING_FOCUS = [
  'B端 SaaS 设计',
  'Agent 流程重构',
  '全栈原型交付',
  '企业降本增效',
]

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`复制${label}`}
      className="ml-1.5 inline-flex shrink-0 items-center rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-mist/80 transition hover:border-accent/50 hover:text-accent"
    >
      {copied ? '已复制' : '复制'}
    </button>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto min-h-screen w-full max-w-7xl px-4 py-24 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable mx-auto block text-center text-4xl font-bold leading-tight text-mist md:text-7xl"
      >
        LET&apos;S WORK
        <br />
        TOGETHER
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center text-lg leading-relaxed text-white md:mt-16 md:text-2xl"
        style={{ textShadow: 'none' }}
      >
        <span>我是一名专注</span>
        <RotatingText
          texts={ROTATING_FOCUS}
          mainClassName="overflow-hidden rounded-lg px-3 py-1 text-white"
          style={{ backgroundColor: '#1e40af' }}
          staggerFrom="last"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={2200}
        />
        <span>的 AI 产品经理</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted md:mt-14 md:text-base"
      >
        <span className="inline-flex flex-wrap items-center">
          <span className="text-mist/60">Email</span>
          <a href={`mailto:${site.email}`} className="ml-2 text-accent hover:underline">
            {site.email}
          </a>
          <CopyButton value={site.email} label="邮箱" />
        </span>
        <span className="hidden text-white/20 sm:inline" aria-hidden>
          ·
        </span>
        <span className="inline-flex flex-wrap items-center">
          <span className="text-mist/60">Phone</span>
          <a href={`tel:${site.phone}`} className="ml-2 text-accent hover:underline">
            {site.phone}
          </a>
        </span>
        <span className="hidden text-white/20 sm:inline" aria-hidden>
          ·
        </span>
        <span className="inline-flex flex-wrap items-center">
          <span className="text-mist/60">WeChat</span>
          <span className="ml-2 text-mist">{site.wechat}</span>
          <CopyButton value={site.wechat} label="微信" />
        </span>
      </motion.div>

      <footer className="mt-24 border-t border-white/5 pt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </footer>
    </section>
  )
}
