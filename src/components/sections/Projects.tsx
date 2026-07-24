import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { projects, type ProjectChain } from '../../data/content'
import WanderingFace from '../three/WanderingFace'

function ProjectBody({
  project,
  introAlign = 'left',
  cylinderExitPainId,
}: {
  project: (typeof projects)[number]
  introAlign?: 'left' | 'center'
  /** Put this id on a matching pain text for cylinder exit timing */
  cylinderExitPainId?: string
}) {
  const introCenter = introAlign === 'center'

  return (
    <div className="relative z-10">
      <div className={introCenter ? 'text-center' : undefined}>
        <h3
          className={`font-display text-2xl font-semibold text-white md:text-3xl ${
            introCenter ? 'mx-auto max-w-3xl px-2' : 'pr-28 sm:pr-32'
          }`}
        >
          <span className={introCenter ? undefined : 'whitespace-nowrap'}>
            {project.name}
            {'nameSuffix' in project ? project.nameSuffix : null}
          </span>
        </h3>
        <p className="mt-1 text-sm text-white">{project.role}</p>
        <p
          className={`mt-3 text-white ${
            introCenter
              ? project.id === 'beauty-saas'
                ? 'mx-auto whitespace-nowrap'
                : 'mx-auto max-w-2xl'
              : ''
          }`}
        >
          {project.blurb}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {project.chains.map((chain, i) => (
          <ChainCard
            key={chain.pain}
            chain={chain}
            index={i}
            painTextId={
              cylinderExitPainId && chain.pain === '通用收银缺少座位 / 开台可视化'
                ? cylinderExitPainId
                : undefined
            }
          />
        ))}
      </div>

      {project.link && (
        <div className={introCenter ? 'mt-5 flex justify-center' : 'mt-5'}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            {project.linkLabel}
            <span aria-hidden>↗</span>
          </a>
        </div>
      )}
    </div>
  )
}

function ChainCard({
  chain,
  index,
  painTextId,
}: {
  chain: ProjectChain
  index: number
  painTextId?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-xl border border-white/10 bg-white/[0.06] p-4 md:p-5"
    >
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <ChainCol label="痛点" text={chain.pain} align="center" textId={painTextId} />
        <ChainCol label="落地动作" text={chain.action} />
        <ChainCol label="落地成果" text={chain.result} align="center" />
      </div>
    </motion.div>
  )
}

function ChainCol({
  label,
  text,
  align = 'left',
  textId,
}: {
  label: string
  text: string
  align?: 'left' | 'center'
  textId?: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-center text-sm font-bold tracking-[0.12em] text-accent md:text-base">{label}</p>
      <p
        id={textId}
        className={`mt-2 text-sm leading-relaxed text-white ${align === 'center' ? 'text-center' : ''}`}
      >
        {text}
      </p>
    </div>
  )
}

export default function Projects() {
  const [first, second] = projects
  const secondCardRef = useRef<HTMLElement>(null)
  const faceInView = useInView(secondCardRef, { amount: 0.12 })

  return (
    <section id="projects" className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        className="font-display text-readable mx-auto text-center text-4xl font-bold text-mist md:text-7xl"
      >
        Projects
      </motion.h2>

      <div className="mt-14 space-y-10">
        <motion.article
          id="project-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="relative flex w-full flex-col rounded-2xl border border-white/15 bg-white/[0.12] p-6 pt-10 text-left shadow-card backdrop-blur-md md:p-8 md:pt-10"
        >
          <p className="absolute right-6 top-5 z-10 text-sm text-accent md:right-8 md:top-6">{first.period}</p>
          <ProjectBody
            project={first}
            introAlign="center"
            cylinderExitPainId="project-1-cylinder-exit"
          />
        </motion.article>

        <motion.article
          ref={secondCardRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative flex min-h-[480px] w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.12] p-6 pt-10 text-left shadow-card backdrop-blur-md md:min-h-[520px] md:p-8 md:pt-10"
        >
          <p className="absolute right-6 top-5 z-10 text-sm text-accent md:right-8 md:top-6">{second.period}</p>
          <ProjectBody project={second} introAlign="center" />
          <WanderingFace cardRef={secondCardRef} active={faceInView} />
        </motion.article>
      </div>
    </section>
  )
}
