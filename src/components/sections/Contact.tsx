import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { site } from '../../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 3200)
  }

  return (
    <section id="contact" className="relative mx-auto min-h-screen w-full max-w-7xl px-4 py-24 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55 }}
        className="font-display text-center text-4xl font-bold leading-tight text-mist md:text-7xl"
      >
        LET&apos;S WORK
        <br />
        TOGETHER
      </motion.h2>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-mist">Contact Form</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Please contact me directly at{' '}
            <a href={`mailto:${site.email}`} className="text-accent underline-offset-2 hover:underline">
              {site.email}
            </a>{' '}
            or drop your info here.
          </p>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-card backdrop-blur-sm"
        >
          <label className="block text-sm text-muted">
            Full name
            <input
              required
              name="name"
              placeholder="Your Name"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-void/60 px-3 py-2.5 text-mist outline-none transition focus:border-accent/60"
            />
          </label>
          <label className="block text-sm text-muted">
            Email Address
            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-void/60 px-3 py-2.5 text-mist outline-none transition focus:border-accent/60"
            />
          </label>
          <label className="block text-sm text-muted">
            Your Message
            <textarea
              required
              name="message"
              rows={4}
              placeholder="Tell me about your project…"
              className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-void/60 px-3 py-2.5 text-mist outline-none transition focus:border-accent/60"
            />
          </label>
          <p className="text-xs text-muted">I&apos;ll never share your data with anyone else. Pinky promise!</p>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full border border-accent/50 bg-accent/15 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/25 hover:shadow-glow"
          >
            {sent ? 'Message queued ✓' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>

      <footer className="mt-24 border-t border-white/5 pt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </footer>
    </section>
  )
}
