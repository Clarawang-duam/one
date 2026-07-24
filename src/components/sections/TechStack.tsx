import { motion } from 'framer-motion'
import { techStack, type TechItem } from '../../data/content'

function TechIcon({ item }: { item: TechItem }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.name}
        className="h-8 w-8 object-contain opacity-95 transition group-hover:opacity-100"
      />
    )
  }

  const label = item.letter ?? item.name.slice(0, 1).toUpperCase()
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] font-bold tracking-wide text-mist/85 transition group-hover:border-accent/50 group-hover:text-accent"
      aria-hidden
    >
      {label}
    </span>
  )
}

export default function TechStack() {
  return (
    <section id="tech" className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-24 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Tech Stack
      </motion.h2>

      <div className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {techStack.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            whileHover={{ y: -6, scale: 1.04 }}
            className="group flex cursor-default flex-col items-center gap-3 rounded-xl border border-white/15 bg-white/[0.12] px-4 py-5 text-center shadow-card backdrop-blur-md transition hover:border-accent/60 hover:bg-accent/15 hover:shadow-glow"
          >
            <TechIcon item={tech} />
            <span className="text-sm font-semibold tracking-wide text-mist group-hover:text-accent md:text-base">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
