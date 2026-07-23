import { motion } from 'framer-motion'
import { techStack } from '../../data/content'

export default function TechStack() {
  return (
    <section id="tech" className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-24 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Tech Stack
      </motion.h2>
      <p className="mt-3 text-sm text-muted">(hint: hover a key)</p>

      <div className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {techStack.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            whileHover={{ y: -6, scale: 1.04 }}
            className="group cursor-default rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center shadow-card backdrop-blur-sm transition hover:border-accent/60 hover:bg-accent/10 hover:shadow-glow"
          >
            <span className="text-sm font-semibold tracking-wide text-mist group-hover:text-accent md:text-base">
              {tech}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
