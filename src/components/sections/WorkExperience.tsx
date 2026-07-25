import { motion } from 'framer-motion'
import { workExperiences } from '../../data/content'

export default function WorkExperience() {
  return (
    <section
      id="work"
      className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-24 md:px-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable text-center text-4xl font-bold text-mist md:text-6xl lg:text-7xl"
      >
        Work Experience
      </motion.h2>

      <div className="mt-14 w-full space-y-6">
        {workExperiences.map((job, index) => (
          <motion.article
            key={job.title + job.company}
            id={index === 0 ? 'work-card' : undefined}
            initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/15 bg-white/[0.12] p-6 shadow-card backdrop-blur-md transition hover:border-accent/50 hover:shadow-glow md:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold text-mist md:text-2xl">{job.title}</h3>
                <p className="mt-1 text-muted">{job.company}</p>
              </div>
              {job.logos && job.logos.length > 0 ? (
                <div className="flex shrink-0 items-center justify-center gap-2 self-center">
                  {job.logos.map((logo) => (
                    <div
                      key={logo.src}
                      className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-7 w-auto object-contain md:h-8"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-1 justify-start sm:justify-end">
                <span className="text-sm text-accent">{job.period}</span>
              </div>
            </div>
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
