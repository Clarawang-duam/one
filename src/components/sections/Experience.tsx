import { motion } from 'framer-motion'
import { experiences } from '../../data/content'

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-24 md:px-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Experience
      </motion.h2>
      <p className="text-readable-soft mt-3 text-center text-muted">工作经历与教育背景</p>

      <div className="mt-14 w-full space-y-6">
        {experiences.map((job, index) => (
          <motion.article
            key={job.title + job.company}
            initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/15 bg-white/[0.12] p-6 shadow-card backdrop-blur-md transition hover:border-accent/50 hover:shadow-glow md:p-8"
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="font-display text-xl font-semibold text-mist md:text-2xl">{job.title}</h3>
              <span className="text-sm text-accent">{job.period}</span>
            </div>
            <p className="mt-1 text-muted">{job.company}</p>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-mist/90 md:text-base">
              {job.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
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
