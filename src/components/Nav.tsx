import { motion } from 'framer-motion'
import { navLinks } from '../data/content'

export default function Nav() {
  return (
    <motion.header
      id="site-nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-void/55 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-wide text-mist transition hover:text-accent md:text-base"
        >
          TOP
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -2 }}
              className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-mist"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent shadow-glow transition hover:border-accent hover:bg-accent/20"
        >
          Hire Me
        </motion.a>
      </div>
    </motion.header>
  )
}
