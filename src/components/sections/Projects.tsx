import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { projects } from '../../data/content'
import FaceScene from '../three/FaceScene'

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [first, second] = projects
  const faceSlot = useRef<HTMLDivElement>(null)
  const faceInView = useInView(faceSlot, { amount: 0.2 })

  return (
    <section id="projects" className="relative mx-auto w-full max-w-7xl px-4 py-24 md:min-h-[110vh] md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Projects
      </motion.h2>

      <div className="mt-14 space-y-10">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-card backdrop-blur-sm md:grid-cols-2 md:gap-10 md:p-8"
        >
          <div>
            <button
              type="button"
              onClick={() => setOpenId(openId === first.id ? null : first.id)}
              className="w-full text-left"
            >
              <h3 className="font-display text-2xl font-semibold text-mist md:text-3xl">{first.name}</h3>
              <p className="mt-2 text-muted">{first.blurb}</p>
              <AnimatePresence>
                {openId === first.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden text-sm leading-relaxed text-mist/85"
                  >
                    {first.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </div>
          <motion.div ref={faceSlot} whileHover={{ scale: 1.02 }} className="relative min-h-[280px]">
            <div className="absolute inset-0 rounded-full bg-accent/10 blur-3xl" />
            {faceInView ? (
              <FaceScene />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted md:h-[360px]">
                …
              </div>
            )}
          </motion.div>
        </motion.article>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => setOpenId(openId === second.id ? null : second.id)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left shadow-card backdrop-blur-sm transition hover:border-accent/50 hover:shadow-glow md:p-8"
        >
          <h3 className="font-display text-2xl font-semibold text-mist md:text-3xl">{second.name}</h3>
          <p className="mt-2 text-muted">{second.blurb}</p>
          <AnimatePresence>
            {openId === second.id && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden text-sm leading-relaxed text-mist/85"
              >
                {second.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </section>
  )
}
