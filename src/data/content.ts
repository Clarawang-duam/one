export const models = {
  blue: '/models/blue.glb',
  red: '/models/red.glb',
  green: '/models/green.glb',
  yellow: '/models/yellow.glb',
  face: '/models/face.glb',
  iron: '/models/iron.glb',
  hellokitty: '/models/hellokitty.glb',
} as const

export const site = {
  name: 'Your Name',
  role: 'A Full Stack Web Developer',
  email: 'hello@example.com',
}

export const navLinks = [
  { href: '#tech', label: 'Tech Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: "Let's Work Together" },
]

export const techStack = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'Tailwind',
  'Three.js',
  'Docker',
  'AWS',
  'Vercel',
  'Git',
  'GraphQL',
  'Redis',
  'Prisma',
]

export const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'Acme Labs',
    period: 'Jan 2025 - Present',
    bullets: [
      'Shipped product features end-to-end from requirements to production.',
      'Built internal tools that cut weekly ops time by ~30%.',
      'Improved API latency with caching and query tuning.',
      'Mentored juniors on React patterns and code review hygiene.',
    ],
    tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    title: 'Freelance Full Stack Developer',
    company: 'Self-employed',
    period: 'Apr 2022 - Dec 2024',
    bullets: [
      'Turned messy spreadsheets into polished internal dashboards.',
      'Delivered custom CMS platforms tailored to each client workflow.',
      'Automated repetitive processes and reduced human error.',
      'Focused on clean, maintainable interfaces people enjoy using.',
    ],
    tags: ['React', 'Vue', 'Node.js', 'MongoDB'],
  },
]

/** Two project slots reserved for your content. */
export const projects = [
  {
    id: 'project-one',
    name: 'Project One',
    blurb: 'Short one-liner goes here',
    detail: 'Replace this with your first project description.',
    showFace: true,
  },
  {
    id: 'project-two',
    name: 'Project Two',
    blurb: 'Short one-liner goes here',
    detail: 'Replace this with your second project description.',
    showFace: false,
  },
]
