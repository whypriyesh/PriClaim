import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import CTA from '../components/landing/CTA'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Footer from '../components/landing/Footer'
import { ShootingStars } from '../components/ui/shooting-stars'
import { StarsBackground } from '../components/ui/stars-background'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-white/20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        <ShootingStars />
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}