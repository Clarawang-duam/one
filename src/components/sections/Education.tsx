import { motion } from 'framer-motion'
import { education } from '../../data/content'

export default function Education() {
  return (
    <section
      id="education"
      className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-16 md:px-8 md:py-20"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Education
      </motion.h2>

      <div className="mt-10 w-full space-y-5">
        {education.map((item, index) => (
          <motion.article
            key={item.title + item.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/15 bg-white/[0.12] p-5 shadow-card backdrop-blur-md transition hover:border-accent/50 hover:shadow-glow md:p-6"
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="font-display text-xl font-semibold text-mist md:text-2xl">{item.title}</h3>
              <span className="text-sm text-accent">{item.period}</span>
            </div>
            <p className="mt-1 text-muted">{item.company}</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mist/90 md:text-base">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
