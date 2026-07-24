import Nav from './components/Nav'
import Starfield from './components/Starfield'
import Contact from './components/sections/Contact'
import Education from './components/sections/Education'
import Hero from './components/sections/Hero'
import Projects from './components/sections/Projects'
import TechStack from './components/sections/TechStack'
import WorkExperience from './components/sections/WorkExperience'
import FloatingCylinders from './components/three/FloatingCylinders'
import ScrollKittyScene from './components/three/ScrollKittyScene'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <ScrollKittyScene />
      {/* z-5: above kitty, under page text/cards (z-10) */}
      <FloatingCylinders />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <TechStack />
          <Education />
          <Projects />
          <WorkExperience />
          <Contact />
        </main>
      </div>
    </div>
  )
}
