import { motion } from 'framer-motion'
import { site } from '../../data/content'

/** Matches fixed nav bar height (py-3 + content ≈ 3.5–4rem) */
const NAV_OFFSET = '4rem'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex w-full items-center overflow-x-clip px-4 pb-10 md:px-8"
      style={{ paddingTop: NAV_OFFSET, minHeight: '100vh' }}
    >
      <div
        className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.2fr)] lg:gap-6"
        style={{ minHeight: `calc(100vh - ${NAV_OFFSET})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-20 max-w-xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.28em] text-muted">Hi, I am</p>
          <h1 className="font-display whitespace-nowrap text-5xl font-bold leading-none text-white md:text-7xl xl:text-8xl">
            {site.name}
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/70 md:text-xl">{site.role}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/20 bg-void/80 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-accent/50 hover:shadow-glow"
            >
              Resume
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-accent/50 bg-accent/20 px-6 py-2.5 text-sm font-medium text-accent backdrop-blur-sm transition hover:bg-accent/30 hover:shadow-glow"
            >
              Hire Me
            </motion.a>
          </div>
        </motion.div>

        {/* Spacer — Kitty lives in fixed ScrollKittyScene */}
        <div className="hidden min-h-[420px] lg:block" aria-hidden />
      </div>
    </section>
  )
}
